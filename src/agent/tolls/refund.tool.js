import { tool } from "@langchain/core/tools";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { z } from "zod";

// Weather Tool
export const getWeather = tool(
    async ({ city }) => {
        return `The weather in ${city} is 28°C and sunny.`;
    },
    {
        name: "getWeather",
        description: "Get the current weather for a city.",
        schema: z.object({ city: z.string() }),
    }
);

// Saare tools ki list
export const tools = [getWeather];

// ToolNode jo graph me use hoga
export const toolNode = new ToolNode(tools);