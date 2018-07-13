import { RequestHook } from "testcafe";
import axios from "axios";

const TEST_URL = process.env.TEST_URL;

export const requestReporter = (logger) => {
  for (let r in logger.requests) {
    const request = logger.requests[r];
    // console.log(request);
    const requestRecord = `${request.response.statusCode} - ${request.request.method.toUpperCase()} ${request.request.url}\n\t${request.response.body}`;
    console.log(requestRecord);
  }
  logger.clear();
}

export class MyRequestHook extends RequestHook {
  constructor(requestFilterRules, responseEventConfigureOpts) {
    if (!responseEventConfigureOpts) {
      responseEventConfigureOpts = {
        includeBody: true,
        includeHeaders: true
      };
    }
    super(requestFilterRules, responseEventConfigureOpts);
  }
  onRequest(event) {
    console.log(
      event.requestOptions.method,
      event.requestOptions.url,
      event.requestOptions.body.toString()
    );
  }
  onResponse(event) {
    console.log(`${event.statusCode}: ${event.body.toString()}`);
  }
}

export const testApi = () => {
  axios
    .get(`${TEST_URL}/users/ping`)
    .then(res => {
      console.log(res.data.message);
    })
    .catch(err => {
      console.error(err);
      process.exit();
    });
};
