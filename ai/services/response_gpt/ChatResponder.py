from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain

class ChatResponder:
    def __init__(self, llm):
        self.llm = llm
        self.prompt = PromptTemplate.from_template(
            """
            당신은 친근하고 자연스러운 대화를 하는 AI입니다.
            다음 질문에 대해 부담 없이 답변해 주세요.

            질문: {question}

            답변:
            """
        )
        self.chain = LLMChain(llm = self.llm, prompt = self.prompt)

    def answer(self, question: str):
        answer = self.chain.run(question = question)
        return {
                "answer": answer,
                "sources": [{
                    "entity_results": {
                        "category": "일상 대화",
                        "intent": "일상 대화"
                    }
                }]
            }
