import { ITreasuryProductDocument } from "../infra/mongoose/entities/TreasuryProduct";

export interface ICreateTreasuryProductDTO {
  name: string;
  treasuryType: "SELIC" | "PREFIXADO" | "PREFIXADO_JUROS" | "IPCA" | "IPCA_JUROS";
  maturityDate: Date;
  userId?: string;
}

export interface ITreasuryProductRepository {
  create(data: ICreateTreasuryProductDTO): Promise<ITreasuryProductDocument>;
  findByName(name: string, userId?: string): Promise<ITreasuryProductDocument | null>;
  findById(id: string): Promise<ITreasuryProductDocument | null>;
  findAll(userId?: string): Promise<ITreasuryProductDocument[]>;
  update(id: string, data: Partial<ICreateTreasuryProductDTO>): Promise<ITreasuryProductDocument | null>;
  delete(id: string): Promise<void>;
}
