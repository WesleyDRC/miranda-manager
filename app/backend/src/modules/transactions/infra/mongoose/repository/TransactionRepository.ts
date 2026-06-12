import { ICreateTransactionDTO } from "../../../dtos/ICreateTransactionDTO";
import { ITransactionRepository } from "../../../repositories/ITransactionRepository";
import { Transaction } from "../entities/Transaction";
import { ITransaction } from "../../../entities/ITransaction";
import { AppError } from "../../../../../shared/errors/AppError";
import mongoose from "mongoose";
import { Wallet } from "../../../../../modules/wallets/infra/mongoose/entities/Wallet";
import { LedgerEntry } from "../../../../../modules/wallets/infra/mongoose/entities/LedgerEntry";

export class TransactionRepository implements ITransactionRepository {
  async create(data: ICreateTransactionDTO): Promise<ITransaction> {
    const createdTx = await Transaction.create(data);

    const tx: ITransaction = {
      id: createdTx.id,
      type: createdTx.type,
      amount: createdTx.amount,
      dueDate: createdTx.dueDate,
      isPaid: createdTx.isPaid,
      isRecurring: createdTx.isRecurring,
      source: createdTx.source,
      description: createdTx.description,
      walletId: createdTx.walletId,
      patrimonyId: createdTx.patrimonyId,
      recurrenceRuleId: createdTx.recurrenceRuleId,
      userId: createdTx.userId,
    };

    return Promise.resolve(tx);
  }

  async findByUserId(userId: string): Promise<ITransaction[]> {
    const txsFound = await Transaction.find({ userId }).sort({ dueDate: 1 });
    
    // Fetch rules to get endDate
    const ruleIds = [...new Set(txsFound.map(t => t.recurrenceRuleId).filter(id => id))];
    const { RecurrenceRule } = await import("../entities/RecurrenceRule");
    const rules = await RecurrenceRule.find({ _id: { $in: ruleIds } });
    const ruleMap = new Map(rules.map(r => [r.id, r]));

    let txs: ITransaction[] = [];

    for (let i = 0; i < txsFound.length; i++) {
      const rule = txsFound[i].recurrenceRuleId ? ruleMap.get(txsFound[i].recurrenceRuleId) : null;
      const tx: ITransaction = {
        id: txsFound[i].id,
        type: txsFound[i].type as "INCOME" | "EXPENSE",
        amount: txsFound[i].amount,
        dueDate: txsFound[i].dueDate,
        isPaid: txsFound[i].isPaid,
        isRecurring: txsFound[i].isRecurring,
        source: txsFound[i].source as "MANUAL" | "RENT" | "FINANCING",
        description: txsFound[i].description,
        walletId: txsFound[i].walletId,
        patrimonyId: txsFound[i].patrimonyId,
        recurrenceRuleId: txsFound[i].recurrenceRuleId,
        ruleEndDate: rule?.endDate,
        userId: txsFound[i].userId,
      };

      txs.push(tx);
    }

    return Promise.resolve(txs);
  }

  async findByPatrimonyId(patrimonyId: string): Promise<ITransaction[]> {
    const txsFound = await Transaction.find({ patrimonyId }).sort({ dueDate: 1 });

    let txs: ITransaction[] = [];

    for (let i = 0; i < txsFound.length; i++) {
      const tx: ITransaction = {
        id: txsFound[i].id,
        type: txsFound[i].type as "INCOME" | "EXPENSE",
        amount: txsFound[i].amount,
        dueDate: txsFound[i].dueDate,
        isPaid: txsFound[i].isPaid,
        isRecurring: txsFound[i].isRecurring,
        source: txsFound[i].source as "MANUAL" | "RENT" | "FINANCING",
        description: txsFound[i].description,
        walletId: txsFound[i].walletId,
        patrimonyId: txsFound[i].patrimonyId,
        recurrenceRuleId: txsFound[i].recurrenceRuleId,
        userId: txsFound[i].userId,
      };

      txs.push(tx);
    }

    return Promise.resolve(txs);
  }

  async findByRecurrenceRuleId(ruleId: string): Promise<ITransaction[]> {
    const txsFound = await Transaction.find({ recurrenceRuleId: ruleId }).sort({ dueDate: 1 });
    let txs: ITransaction[] = [];
    for (let i = 0; i < txsFound.length; i++) {
      txs.push({
        id: txsFound[i].id,
        type: txsFound[i].type as "INCOME" | "EXPENSE",
        amount: txsFound[i].amount,
        dueDate: txsFound[i].dueDate,
        isPaid: txsFound[i].isPaid,
        isRecurring: txsFound[i].isRecurring,
        source: txsFound[i].source as "MANUAL" | "RENT" | "FINANCING",
        description: txsFound[i].description,
        walletId: txsFound[i].walletId,
        patrimonyId: txsFound[i].patrimonyId,
        recurrenceRuleId: txsFound[i].recurrenceRuleId,
        userId: txsFound[i].userId,
      });
    }
    return Promise.resolve(txs);
  }

  async findById(id: string): Promise<ITransaction | null> {
    const txFound = await Transaction.findOne({ _id: id });

    if (!txFound) {
      return null;
    }

    return {
      id: txFound._id,
      type: txFound.type as "INCOME" | "EXPENSE",
      amount: txFound.amount,
      dueDate: txFound.dueDate,
      isPaid: txFound.isPaid,
      isRecurring: txFound.isRecurring,
      source: txFound.source as "MANUAL" | "RENT" | "FINANCING",
      description: txFound.description,
      walletId: txFound.walletId,
      patrimonyId: txFound.patrimonyId,
      recurrenceRuleId: txFound.recurrenceRuleId,
      userId: txFound.userId,
    };
  }

  async markAsPaid(id: string, walletId: string): Promise<ITransaction> {
    const session = await mongoose.startSession();
    let updatedTxData: any;

    try {
      await session.withTransaction(async () => {
        // 1. Fetch and lock Transaction (na verdade, withTransaction já garante atomicidade, mas vamos buscar para ler valores)
        const tx = await Transaction.findOne({ _id: id }).session(session);
        if (!tx) throw new AppError("Transaction not found", 404);
        if (tx.isPaid) throw new AppError("Transaction already paid", 400);

        // 2. Update Transaction
        tx.isPaid = true;
        tx.walletId = walletId;
        await tx.save({ session });
        updatedTxData = tx;

        // 3. Fetch Wallet
        const wallet = await Wallet.findOne({ _id: walletId }).session(session);
        if (!wallet) throw new AppError("Wallet not found", 404);

        // 4. Calculate effect on balance
        const amountToApply = tx.type === "INCOME" ? tx.amount : -tx.amount;
        wallet.balance += amountToApply;
        await wallet.save({ session });

        // 5. Create Ledger Entry
        await LedgerEntry.create([{
          walletId: wallet._id,
          transactionId: tx._id,
          type: tx.type === "INCOME" ? "CREDIT" : "DEBIT",
          amount: tx.amount,
          description: `Pagamento da transação: ${tx.description}`,
        }], { session });
      });
    } catch (err) {
      throw err;
    } finally {
      session.endSession();
    }

    return {
      id: updatedTxData._id,
      type: updatedTxData.type as "INCOME" | "EXPENSE",
      amount: updatedTxData.amount,
      dueDate: updatedTxData.dueDate,
      isPaid: updatedTxData.isPaid,
      isRecurring: updatedTxData.isRecurring,
      source: updatedTxData.source as "MANUAL" | "RENT" | "FINANCING",
      description: updatedTxData.description,
      walletId: updatedTxData.walletId,
      patrimonyId: updatedTxData.patrimonyId,
      recurrenceRuleId: updatedTxData.recurrenceRuleId,
      userId: updatedTxData.userId,
    };
  }

  async update(id: string, data: Partial<ITransaction>): Promise<ITransaction> {
    const updated = await Transaction.findByIdAndUpdate(id, data, { new: true });
    if (!updated) {
      throw new Error("Transaction not found");
    }

    return {
      id: updated._id,
      type: updated.type as "INCOME" | "EXPENSE",
      amount: updated.amount,
      dueDate: updated.dueDate,
      isPaid: updated.isPaid,
      isRecurring: updated.isRecurring,
      source: updated.source as "MANUAL" | "RENT" | "FINANCING",
      description: updated.description,
      walletId: updated.walletId,
      patrimonyId: updated.patrimonyId,
      recurrenceRuleId: updated.recurrenceRuleId,
      userId: updated.userId,
    };
  }

  async delete(id: string): Promise<void> {
    await Transaction.deleteOne({ _id: id });
  }

  async deleteByRecurrenceRuleId(ruleId: string): Promise<void> {
    // Apenas deleta transações futuras que ainda não foram pagas
    await Transaction.deleteMany({ recurrenceRuleId: ruleId, isPaid: false });
  }

  async deleteByPatrimonyId(patrimonyId: string): Promise<void> {
    // Deleta transacoes de financiamento nao pagas associadas ao patrimonio
    await Transaction.deleteMany({ patrimonyId, isPaid: false });
  }

  async updateFutureUnpaidByRuleId(ruleId: string, data: Partial<ITransaction>): Promise<void> {
    const updatePayload: any = {};
    if (data.amount !== undefined) updatePayload.amount = data.amount;
    if (data.description !== undefined) updatePayload.description = data.description;
    
    if (Object.keys(updatePayload).length > 0) {
      await Transaction.updateMany(
        { recurrenceRuleId: ruleId, isPaid: false, dueDate: { $gte: new Date() } },
        { $set: updatePayload }
      );
    }
  }

  async deleteUnpaidAfterDateByRuleId(ruleId: string, date: Date): Promise<void> {
    await Transaction.deleteMany({
      recurrenceRuleId: ruleId,
      isPaid: false,
      dueDate: { $gt: date }
    });
  }

  async deleteAllByRecurrenceRuleId(ruleId: string): Promise<void> {
    await Transaction.deleteMany({ recurrenceRuleId: ruleId });
  }
}
