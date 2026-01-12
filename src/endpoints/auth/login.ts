import { Bool, OpenAPIRoute, Str } from "chanfana";
import { z } from "zod";
import { AppContext } from "../../types";
import { generateCookie, setCookie } from "hono/cookie";
import { sign } from "hono/jwt";

export class Login extends OpenAPIRoute {
  schema = {
    tags: ["Auth"],
    summary: "Login to get access token",
    request: {
      body: {
        content: {
          "application/json": {
            schema: z.object({
              password: Str(),
            }),
          },
        },
      },
    },
    responses: {
      "200": {
        description: "Login successful",
        content: {
          "application/json": {
            schema: z.object({
              success: Bool(),
            }),
          },
        },
      },
      "401": {
        description: "Invalid password",
        content: {
          "application/json": {
            schema: z.object({
              success: Bool(),
              error: Str(),
            }),
          },
        },
      },
    },
  };

  async handle(c: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();
    const { password } = data.body;
    const env = c.env;

    if (password !== env.ADMIN_PASSWORD) {
      return c.json(
        {
          success: false,
          error: "Invalid password",
        },
        401
      );
    }

    const payload = {
      role: "admin",
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
    };

    const token = await sign(payload, env.JWT_SECRET);

    const cookie = generateCookie("auth_session", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });
    return c.json({
      success: true,
    }, 200, {
      'Set-Cookie': cookie
    })
  }
}
