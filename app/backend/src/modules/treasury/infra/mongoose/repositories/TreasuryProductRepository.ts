import { ICreateTreasuryProductDTO, ITreasuryProductRepository } from "../../../repositories/ITreasuryProductRepository";
import { TreasuryProduct, ITreasuryProductDocument } from "../entities/TreasuryProduct";

export class TreasuryProductRepository implements ITreasuryProductRepository {
  async create(data: ICreateTreasuryProductDTO): Promise<ITreasuryProductDocument> {
    const product = new TreasuryProduct(data);
    await product.save();
    return product;
  }

  async findByName(name: string, userId?: string): Promise<ITreasuryProductDocument | null> {
    const query: any = { name };
    if (userId) {
      query.$or = [{ userId }, { userId: { $exists: false } }, { userId: null }];
    } else {
      query.userId = { $exists: false };
    }
    return TreasuryProduct.findOne(query);
  }

  async findById(id: string): Promise<ITreasuryProductDocument | null> {
    return TreasuryProduct.findById(id);
  }

  async findAll(userId?: string): Promise<ITreasuryProductDocument[]> {
    const query: any = {};
    if (userId) {
      query.$or = [{ userId }, { userId: { $exists: false } }, { userId: null }];
    } else {
      query.$or = [{ userId: { $exists: false } }, { userId: null }];
    }
    return TreasuryProduct.find(query).sort({ maturityDate: 1 });
  }

  async update(id: string, data: Partial<ICreateTreasuryProductDTO>): Promise<ITreasuryProductDocument | null> {
    return TreasuryProduct.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<void> {
    await TreasuryProduct.findByIdAndDelete(id);
  }
}
