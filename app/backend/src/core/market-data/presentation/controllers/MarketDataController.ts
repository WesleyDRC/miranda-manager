import { Request, Response } from "express";
import { container } from "tsyringe";
import { GetMarketDataUseCase } from "@/core/market-data/application/useCases/GetMarketDataUseCase";

export class MarketDataController {
  async getSelic(request: Request, response: Response): Promise<Response> {
    const getMarketData = container.resolve(GetMarketDataUseCase);
    const selic = await getMarketData.getSelicCurrent();
    return response.json({ value: selic });
  }

  async getIpcaFocus(request: Request, response: Response): Promise<Response> {
    const getMarketData = container.resolve(GetMarketDataUseCase);
    const ipca = await getMarketData.getIpcaFocusProjection();
    return response.json({ value: ipca });
  }

  async stream(request: Request, response: Response): Promise<void> {
    response.setHeader("Content-Type", "text/event-stream");
    response.setHeader("Cache-Control", "no-cache");
    response.setHeader("Connection", "keep-alive");
    response.flushHeaders(); // Estabelece a conexão SSE imediatamente

    const getMarketData = container.resolve(GetMarketDataUseCase);

    const sendData = async () => {
      try {
        const selic = await getMarketData.getSelicCurrent();
        const ipca = await getMarketData.getIpcaFocusProjection();
        
        const payload = JSON.stringify({
          selic,
          ipca,
          timestamp: new Date().toISOString()
        });

        // O formato SSE exige "data: " seguido do payload e dois quebras de linha
        response.write(`data: ${payload}\n\n`);
      } catch (err) {
        console.error("SSE stream error:", err);
      }
    };

    // Envia o primeiro dado imediatamente
    await sendData();

    // Atualiza a cada 30 segundos para manter a conexão ativa (Heartbeat)
    const intervalId = setInterval(sendData, 30000);

    request.on("close", () => {
      clearInterval(intervalId);
      response.end();
    });
  }
}
