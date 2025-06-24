import React from "react";

const KeywordTable = ({ keywords }) => {
    if (!keywords || keywords.length === 0) {
        return <p>키워드 데이터가 없습니다.</p>;
    }

    // value 기준 내림차순 정렬
    const sortedKeywords = [...keywords].sort((a, b) => b.value - a.value);

    return (
        <table className="min-w-full border-collapse border border-gray-300">
        <thead>
            <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">순위</th>
            <th className="border border-gray-300 px-4 py-2 text-left">키워드</th>
            </tr>
        </thead>
        <tbody>
            {sortedKeywords.map((item, index) => (
            <tr key={`${item.text}-${index}`} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2">{item.text}</td>
            </tr>
            ))}
        </tbody>
        </table>
    );
};

export default KeywordTable;
