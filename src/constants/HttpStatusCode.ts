enum HttpStatusCode {
  // Sucesso (2xx)
  OK = 200,
  Created = 201,
  NoContent = 204,

  // Erro do cliente (4xx)
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,

  // Erro do servidor (5xx)
  InternalServerError = 500,
  BadGateway = 502,
  GatewayTimeout = 504,

}

export { HttpStatusCode };
