import { Request, Response } from "express";
import { container } from "tsyringe";
import { ForecastService } from "@/modules/forecast/services/ForecastService";

export class GetForecastController {
  public async handle(request: Request, response: Response) {
    const { id: userId } = request.user;
    const { simulateScenario } = request.query;

    const forecastService = container.resolve(ForecastService);

    const forecastResult = await forecastService.execute(
      userId, 
      simulateScenario as "LOSS_JOB" | "SELL_CAR" | "NEW_BABY" | undefined
    );

    return response.status(200).json(forecastResult);
  }
}
