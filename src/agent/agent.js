
import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";

import { AIMessage, SystemMessage } from "@langchain/core/messages";

import dotenv from "dotenv";

dotenv.config();





import { model, SYSTEM_PROMPT } from "./llm.js";
import { toolNode } from "./tolls/order.js";





// 3. Agent Node (Jo LLM se baat karega)


async function callModel(state, config) {

    console.log("CONFIG DATA:", config.configurable);

    const { userId, courseId } = config.configurable || {};

    const response = await model.invoke([

        new SystemMessage(SYSTEM_PROMPT),

        new SystemMessage(`
        Backend data:
        userId: ${userId}
        courseId: ${courseId}

        Course ID already provided by backend.
        Do not ask user for Course ID.
        `),

        ...state.messages,

    ]);

    return {
        messages: [response]
    };
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

export default app
