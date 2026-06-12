import { container } from "tsyringe";

import { JwTProvider } from "@/shared/container/providers/TokenProvider/implementations/TokenProvider";
import { ITokenProvider } from "@/shared/container/providers/TokenProvider/models/ITokenProvider";

container.registerSingleton<ITokenProvider>("TokenProvider", JwTProvider);
