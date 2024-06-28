import { container } from "tsyringe";

import { JwTProvider } from "./implementations/TokenProvider";
import { ITokenProvider } from "./models/ITokenProvider";

container.registerSingleton<ITokenProvider>("TokenProvider", JwTProvider);
