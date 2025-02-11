import "dotenv/config";
import { Application } from "express";
import { ApplicationType } from "./libs/enum/application-type.enum";
import { createServer } from "./app";

async function boot() {
  const appType: ApplicationType = (process.env.APP_TYPE || ApplicationType.API) as ApplicationType;
  let _server: Application | undefined = appType === ApplicationType.API && createServer();
  let serverName: string = "api";

  try {
    
    const port = parseInt(process.env.PORT || "5000", 10);

    if (_server) {
      _server.listen(port, () => {
        console.log(`APP (${serverName}) is running on port ${port}`);
      });
    }
  } catch (error) {
    console.error('Failed to boot the application', error);
    process.exit(1);
  }
}

boot();