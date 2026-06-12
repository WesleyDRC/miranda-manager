import { ICreateTransactionDTO } from "../../../dtos/ICreateTransactionDTO";
import { ITransactionRepository } from "../../../repositories/ITransactionRepository";
import { Transaction } from "../entities/Transaction";
import { ITransaction } from "../../../entities/ITransaction";
import { AppError } from "../../../../../shared/errors/AppError";
import mongoose from "mongoose";

export class TransactionRepository implements ITransactionRepository {
  async createMany(data: ICreateTransactionDTO[]): Promise<void> {
    await Transaction.insertMany(data);
  }

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
    const RecurrenceRule = mongoose.model("RecurrenceRule");
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

  async markAsPaid(id: string, walletId: string, session?: any): Promise<ITransaction> {
    const tx = await Transaction.findOne({ _id: id }).session(session);
    if (!tx) throw new AppError("Transaction not found", 404);
    if (tx.isPaid) throw new AppError("Transaction already paid", 400);

    tx.isPaid = true;
    tx.walletId = walletId;
    await tx.save({ session });

    return {
      id: tx._id,
      type: tx.type as "INCOME" | "EXPENSE",
      amount: tx.amount,
      dueDate: tx.dueDate,
      isPaid: tx.isPaid,
      isRecurring: tx.isRecurring,
      source: tx.source as "MANUAL" | "RENT" | "FINANCING",
      description: tx.description,
      walletId: tx.walletId,
      patrimonyId: tx.patrimonyId,
      recurrenceRuleId: tx.recurrenceRuleId,
      userId: tx.userId,
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
