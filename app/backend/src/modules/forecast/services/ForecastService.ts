import { inject, injectable } from "tsyringe";
import { ForecastDataFetcher } from "./ForecastDataFetcher";
import { TimelineBuilder, IForecastOptions } from "./TimelineBuilder";

interface IForecastResult {
  currentBalance: number;
  currentEquity: number;
  projectionMonths: number;
  bankruptMonthIndex: number | null;
  bankruptDate: string | null;
  projectedDebt: number | null;
  bailoutPlan: string | null;
  autoRescues?: Array<{ date: string, amount: number, titleName: string }>;
  timeline: Array<any>;
}

@injectable()
export class ForecastService {
  constructor(
    @inject("ForecastDataFetcher")
    private forecastDataFetcher: ForecastDataFetcher,
    @inject("TimelineBuilder")
    private timelineBuilder: TimelineBuilder
  ) {}

  public async execute(
    userId: string,
    options: IForecastOptions = {}
  ): Promise<IForecastResult> {
    const today = new Date();
    
    // 1. Buscamos todos os dados necessários usando o DataFetcher especializado
    const contextData = await this.forecastDataFetcher.fetchAll(userId);
    
    // 2. Delegamos a construção matemática para o TimelineBuilder e suas estratégias
    const result = this.timelineBuilder.build(contextData, options, today);
    
    return result;
  }
}
