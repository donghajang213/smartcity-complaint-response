from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain

class SmartCityAPIResponder:
    def __init__(self, llm):
        self.llm = llm
        self.prompt = PromptTemplate.from_template(
            """
            아래는 사용자의 질문과 해당 질문과 관련된 공공 API 결과입니다.
            이 정보를 참고하여 사용자에게 친절하고 명확하게 답변해주세요.

            [질문]
            {question}

            [공공API 정보]
            {api_context}

            [답변]
            """
        )
        self.chain = LLMChain(llm = self.llm, prompt = self.prompt)

    def answer(self, api_results: dict):
        question = api_results["question"]
        api_context = self._format_api_results(api_results["results"])
        answer = self.chain.run(question = question, api_context = api_context)
        return {
                "answer": answer,
                "sources": api_results["results"]
            }

    def _format_api_results(self, results):
        """results: list of dicts with 'entity_results' and 'API_results'"""
        formatted_blocks = []
        for idx, r in enumerate(results):
            entity = r.get("entity_results", {})
            api_data = r.get("API_results", {})
            category = entity.get("category", f"카테고리{idx+1}")
            formatted_api = self._format_single_api_result(api_data)
            block = f"📌 [{category}]\n{formatted_api}"
            formatted_blocks.append(block)
        return "\n\n".join(formatted_blocks)

    def _format_single_api_result(self, api_data):
        if hasattr(api_data, "to_string"):
            return api_data.to_string(index = False)
        elif isinstance(api_data, dict):
            return "\n".join([f"{k}: {v}" for k, v in api_data.items()])
        elif isinstance(api_data, list):
            return "\n".join([str(item) for item in api_data])
        else:
            return str(api_data)
