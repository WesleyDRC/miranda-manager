import { ICreatePatrimonyDTO } from "../../../dtos/ICreatePatrimonyDTO";
import { IPatrimonyRepository } from "../../../repositories/IPatrimonyRepository";
import { Patrimony } from "../entities/Patrimony";
import { IPatrimony } from "../../../entities/IPatrimony";
import { AppError } from "../../../../../shared/errors/AppError";

export class PatrimonyRepository implements IPatrimonyRepository {
  async create(data: ICreatePatrimonyDTO): Promise<IPatrimony> {
    const createdPatrimony = await Patrimony.create(data);

    const patrimony: IPatrimony = {
      id: createdPatrimony.id,
      name: createdPatrimony.name,
      type: createdPatrimony.type,
      marketValue: createdPatrimony.marketValue,
      isFinanced: createdPatrimony.isFinanced,
      financingDetails: createdPatrimony.financingDetails,
      vehicleDetails: createdPatrimony.vehicleDetails,
      realEstateDetails: createdPatrimony.realEstateDetails,
      userId: createdPatrimony.userId,
      createdAt: (createdPatrimony as any).createdAt,
      updatedAt: (createdPatrimony as any).updatedAt,
    };

    return Promise.resolve(patrimony);
  }

  async findByUserId(userId: string): Promise<IPatrimony[]> {
    const patrimoniesFound = await Patrimony.find({ userId });

    let patrimonies: IPatrimony[] = [];

    for (let i = 0; i < patrimoniesFound.length; i++) {
      const patrimony: IPatrimony = {
        id: patrimoniesFound[i].id,
        name: patrimoniesFound[i].name,
        type: patrimoniesFound[i].type as "VEHICLE" | "REAL_ESTATE" | "OTHER",
        marketValue: patrimoniesFound[i].marketValue,
        isFinanced: patrimoniesFound[i].isFinanced,
        financingDetails: patrimoniesFound[i].financingDetails,
        vehicleDetails: patrimoniesFound[i].vehicleDetails,
        realEstateDetails: patrimoniesFound[i].realEstateDetails,
        userId: patrimoniesFound[i].userId,
        createdAt: (patrimoniesFound[i] as any).createdAt,
        updatedAt: (patrimoniesFound[i] as any).updatedAt,
      };

      patrimonies.push(patrimony);
    }

    return Promise.resolve(patrimonies);
  }

  async findById(id: string): Promise<IPatrimony | null> {
    const patrimonyFound = await Patrimony.findOne({ _id: id });

    if (!patrimonyFound) {
      return null;
    }

    return {
      id: patrimonyFound._id,
      name: patrimonyFound.name,
      type: patrimonyFound.type as "VEHICLE" | "REAL_ESTATE" | "OTHER",
      marketValue: patrimonyFound.marketValue,
      isFinanced: patrimonyFound.isFinanced,
      financingDetails: patrimonyFound.financingDetails,
      vehicleDetails: patrimonyFound.vehicleDetails,
      realEstateDetails: patrimonyFound.realEstateDetails,
      userId: patrimonyFound.userId,
      createdAt: (patrimonyFound as any).createdAt,
      updatedAt: (patrimonyFound as any).updatedAt,
    };
  }

  async delete(id: string): Promise<void> {
    await Patrimony.deleteOne({ _id: id });
  }

  async update(id: string, data: Partial<IPatrimony>): Promise<IPatrimony> {
    const updatedPatrimony = await Patrimony.findOneAndUpdate(
      { _id: id },
      { $set: data },
      { new: true }
    );

    if (!updatedPatrimony) {
      throw new AppError("Patrimony not found", 404);
    }

    return {
      id: updatedPatrimony._id,
      name: updatedPatrimony.name,
      type: updatedPatrimony.type as "VEHICLE" | "REAL_ESTATE" | "OTHER",
      marketValue: updatedPatrimony.marketValue,
      isFinanced: updatedPatrimony.isFinanced,
      financingDetails: updatedPatrimony.financingDetails,
      vehicleDetails: updatedPatrimony.vehicleDetails,
      realEstateDetails: updatedPatrimony.realEstateDetails,
      userId: updatedPatrimony.userId,
      createdAt: (updatedPatrimony as any).createdAt,
      updatedAt: (updatedPatrimony as any).updatedAt,
    };
  }
}
