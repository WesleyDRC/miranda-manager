import { Request, Response } from "express";
import { container } from "tsyringe";

import { GetRentDashboardUseCase } from "../../../useCases/GetRentDashboardUseCase";

export class GetRentDashboardController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;

    const getRentDashboardUseCase = container.resolve(GetRentDashboardUseCase);

    const dashboardData = await getRentDashboardUseCase.execute({ userId });

    return response.json(dashboardData);
  }
}
