export interface IUseCase<IRequest = any, IResponse = any> {
  execute(data?: IRequest): Promise<IResponse>;
}
