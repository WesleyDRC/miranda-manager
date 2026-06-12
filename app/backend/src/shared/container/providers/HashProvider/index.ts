import { container } from "tsyringe";

import { BCryptHashProvider } from "@/shared/container/providers/HashProvider/implementations/BCryptHashProvider";
import { IHashProvider } from "@/shared/container/providers/HashProvider/models/IHashProvider";

container.registerSingleton<IHashProvider>("HashProvider", BCryptHashProvider);
