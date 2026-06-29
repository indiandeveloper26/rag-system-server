
import { tool } from "@langchain/core/tools";
import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { AIMessage } from "@langchain/core/messages";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();
import { ChatGroq } from "@langchain/groq"

// 1. Apna Ek Simple Tool Banao
const getWeather = tool(
    async ({ city }) => {
        return `The weather in ${city} is 28°C and sunny.`;
    },
    {
        name: "getWeather",
        description: "Get the current weather for a city.",
        schema: z.object({ city: z.string() }),
    }
);

const tools = [getWeather];
const toolNode = new ToolNode(tools);

// 2. LLM Model ko Tools ke sath bind karo







const model = new ChatGroq({

    apiKey: process.env.GROQ_API_KEY,

    model: "llama-3.3-70b-versatile",

    temperature: 0.2

}).bindTools(tools);



// 3. Agent Node (Jo LLM se baat karega)
async function callModel(state) {
    const response = await model.invoke(state.messages);
    return { messages: [response] }; // Yeh automatically history me naya message jod dega
}

// 4. Router Function (Jo decide karega tool chalana hai ya rukna hai)
function shouldContinue(state) {
    const lastMessage = state.messages[state.messages.length - 1];

    // Agar LLM ne tool call karne ko bola hai
    if (lastMessage instanceof AIMessage && lastMessage.tool_calls?.length) {
        return "tools";
    }
    // Agar tool call nahi hai, to ruk jao
    return "__end__";
}

// 5. Graph Assembly (Nodes aur Edges ko jorna)
const workflow = new StateGraph(MessagesAnnotation)
    .addNode("agent", callModel)
    .addNode("tools", toolNode)
    .addEdge("__start__", "agent") // Pehle agent ke paas jao
    .addConditionalEdges("agent", shouldContinue) // Agent ke baad check karo kahan jana hai
    .addEdge("tools", "agent"); // Tool chalne ke baad wapas agent ke paas jao

// Compile the Graph
const app = workflow.compile();

// 6. Run Karne Ka Tareeka
async function start() {
    const response = await app.invoke({
        messages: [{ role: "user", content: "Delhi ka weather kaisa hai?" }],
    });

    console.log("AI Response:", response.messages[response.messages.length - 1].content);
}

start().catch(console.error);