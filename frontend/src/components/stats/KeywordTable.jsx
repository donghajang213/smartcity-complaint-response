import React from "react";

const KeywordTable = ({ keywords }) => {
    if (!keywords || keywords.length === 0) {
        return <p>키워드 데이터가 없습니다.</p>;
    }

    const sortedKeywords = [...keywords].sort((a, b) => b.value - a.value);

    return (
        <div className="max-h-80 overflow-y-auto border border-gray-300 rounded">
            <table className="min-w-full border-collapse">
                <thead className="bg-gray-100 sticky top-0">
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
        </div>
    );
};

export default KeywordTable;
