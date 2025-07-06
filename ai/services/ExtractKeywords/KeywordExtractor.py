from kiwipiepy import Kiwi

class KeywordExtractor:
    def __init__(self, use_compound=True):
        self.kiwi = Kiwi()
        self.use_compound = use_compound

        # 사용자 사전에 복합명사 등록
        self.kiwi.add_user_word("미세먼지", "NNG")
        
    def extract(self, text: str) -> list[str]:
        nouns = []
        result = self.kiwi.analyze(text)
        for token in result[0][0]:
            if token.tag in ["NNG", "NNP"]:
                nouns.append(token.form)
        return nouns

