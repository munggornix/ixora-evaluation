import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Upload, User, BarChart3, Award, FileSpreadsheet, ChevronDown, CheckCircle2, TrendingUp, Sparkles, Loader2, AlertCircle, Users, Calendar, Printer, Plus, X, Info, Cloud, Clock } from 'lucide-react';
// --- ข้อมูลตัวอย่างสมมติ ---
const defaultCsvString = `IX | FLIX EVALUATION DATA BASE,,,,,,,,,,,,,,
Code ,Name ,IX | FL,Yrs Started,TEAM,Evaluator ,Quarter,Design Skill,Management ,Final Product,Working Attitude ,Developemnt ,Maturity & Leadership,Innovative,Corporate Awareness
Column1,Column2,Column3,Column4,Column5,Column6,Column7,Column8,Column9,Column10,Column11,Column12,Column13,Column14,Column15
26,พนักงานตัวอย่าง 01,DEMO,2020,SU,SU,Q1,6,6,6,6,4,5,4,4
26,พนักงานตัวอย่าง 01,DEMO,2020,SU,SU,Q2,6,6,7,6,6,5,5,4
26,พนักงานตัวอย่าง 01,DEMO,2020,SU,SU,Q3,6,6,6,6,6,5,5,4
26,พนักงานตัวอย่าง 01,DEMO,2020,SU,SU,Q4,6,6,6,6,6,5,6,4
25,พนักงานตัวอย่าง 02,DEMO,2020,SU,SU,Q1,5,6,6,5,4,5,4,4
25,พนักงานตัวอย่าง 02,DEMO,2020,SU,SU,Q2,5,6,6,5,5,5,4,4
25,พนักงานตัวอย่าง 02,DEMO,2020,SU,SU,Q3,6,6,6,6,6,5,6,4
25,พนักงานตัวอย่าง 02,DEMO,2020,SU,SU,Q4,6,6,7,6,6,5,7,4
31,พนักงานตัวอย่าง 03,DEMO,2023,SU,SU,Q1,5,5,5,5,4,3,4,4
31,พนักงานตัวอย่าง 03,DEMO,2023,SU,SU,Q2,5,5,5,5,5,4,5,4
31,พนักงานตัวอย่าง 03,DEMO,2023,SU,SU,Q3,6,6,6,6,7,4,6,4
31,พนักงานตัวอย่าง 03,DEMO,2023,SU,SU,Q4,6,6,7,6,7,4,7,4
18,พนักงานตัวอย่าง 04,DEMO,2021,SU,SU,Q1,7,6,7,6,5,4,6,4
18,พนักงานตัวอย่าง 04,DEMO,2021,SU,SU,Q2,6,6,7,6,6,5,6,4
18,พนักงานตัวอย่าง 04,DEMO,2021,SU,SU,Q3,7,6,8,7,6,6,6,4
18,พนักงานตัวอย่าง 04,DEMO,2021,SU,SU,Q4,7,6,8,7,6,6,6,4`;

const scoreCategories = [
  "Design Skill", "Management", "Final Product", "Working Attitude",
  "Developemnt", "Maturity & Leadership", "Innovative", "Corporate Awareness"
];

const formatCategoryName = (name) => {
  if (name === "Developemnt") return "Development";
  if (name === "Final Product") return "Final Product";
  return name;
};

// สีสำหรับแต่ละ Quarter ในโหมดดูคนเดียว
const qColors = {
  "Q1": "#f59e0b", "Q2": "#ec4899", "Q3": "#0ea5e9", "Q4": "#8b5cf6",
};

// --- ข้อมูลน้ำหนักคะแนน (Weights) ---
const categoryWeights = {
  "Design Skill": 0.20,
  "Management": 0.20,
  "Final Product": 0.20,
  "Working Attitude": 0.10,
  "Developemnt": 0.10, 
  "Maturity & Leadership": 0.10,
  "Innovative": 0.05,
  "Corporate Awareness": 0.05
};

// ธีมสีสำหรับคนสูงสุด 6 คน
const themeColors = [
  { stroke: "#6366f1", fill: "rgba(99, 102, 241, 0.25)", bg: "bg-indigo-500", text: "text-indigo-600", lightBg: "bg-indigo-50", border: "border-indigo-200", gradient: "from-indigo-500 to-purple-600" }, 
  { stroke: "#10b981", fill: "rgba(16, 185, 129, 0.25)", bg: "bg-emerald-500", text: "text-emerald-600", lightBg: "bg-emerald-50", border: "border-emerald-200", gradient: "from-emerald-500 to-teal-600" }, 
  { stroke: "#f43f5e", fill: "rgba(244, 63, 94, 0.25)", bg: "bg-rose-500", text: "text-rose-600", lightBg: "bg-rose-50", border: "border-rose-200", gradient: "from-rose-500 to-pink-600" }, 
  { stroke: "#f59e0b", fill: "rgba(245, 158, 11, 0.25)", bg: "bg-amber-500", text: "text-amber-600", lightBg: "bg-amber-50", border: "border-amber-200", gradient: "from-amber-500 to-orange-600" }, 
  { stroke: "#8b5cf6", fill: "rgba(139, 92, 246, 0.25)", bg: "bg-violet-500", text: "text-violet-600", lightBg: "bg-violet-50", border: "border-violet-200", gradient: "from-violet-500 to-fuchsia-600" }, 
  { stroke: "#0ea5e9", fill: "rgba(14, 165, 233, 0.25)", bg: "bg-sky-500", text: "text-sky-600", lightBg: "bg-sky-50", border: "border-sky-200", gradient: "from-sky-500 to-blue-500" }, 
];

// คอมโพเนนต์สำหรับสร้าง Radar Chart
const RadarChart = ({ categories, allMetrics, selectedQuarter }) => {
  const size = 340;
  const center = size / 2;
  const radius = size / 2.8;

  const getPoint = (value, index, total) => {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const r = (value / 10) * radius;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
  };

  const isCompareMode = allMetrics.length > 1;

  const bgPolygons = Array.from({ length: 5 }).map((_, i) => {
    const levelVal = ((i + 1) / 5) * 10;
    const points = categories.map((_, idx) => {
      const p = getPoint(levelVal, idx, categories.length);
      return `${p.x},${p.y}`;
    }).join(" ");
    return <polygon key={i} points={points} fill={i % 2 === 0 ? "#f8fafc" : "#f1f5f9"} stroke="#cbd5e1" strokeWidth="0.5" />;
  });

  const scaleLabels = Array.from({ length: 5 }).map((_, i) => {
    const levelVal = ((i + 1) / 5) * 10;
    const pct = levelVal * 10;
    const angle = -Math.PI / 2;
    const r = (levelVal / 10) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return (
      <text key={`scale-${i}`} x={x + 4} y={y} fontSize="9" fontWeight="bold" fill="#94a3b8" alignmentBaseline="middle">
        {pct}%
      </text>
    );
  });

  const axes = categories.map((_, idx) => {
    const p = getPoint(10, idx, categories.length);
    return <line key={idx} x1={center} y1={center} x2={p.x} y2={p.y} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" />;
  });

  const labels = categories.map((cat, idx) => {
    const p = getPoint(12.6, idx, categories.length);
    return (
      <text key={idx} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" className="text-[11px] font-bold fill-slate-700">
        {formatCategoryName(cat)}
      </text>
    );
  });

  return (
    <div className="flex flex-col items-center w-full">
      <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="overflow-visible max-w-full drop-shadow-sm">
        {bgPolygons}
        {axes}
        {scaleLabels}
        
        {!isCompareMode && allMetrics[0] && (
          <g>
            {allMetrics[0].rawData.map((row, rIdx) => {
              const q = row.Quarter;
              const color = qColors[q] || "#94a3b8";
              const isSelected = selectedQuarter === q;
              const opacity = (selectedQuarter === "All" || isSelected) ? 1 : 0.2;
              const strokeWidth = isSelected ? "2" : "1.5";
              
              const points = categories.map((cat, idx) => {
                const val = parseFloat(row[cat]) || 0;
                const p = getPoint(val, idx, categories.length);
                return `${p.x},${p.y}`;
              }).join(" ");

              return (
                <polygon 
                  key={`q-${rIdx}`} points={points} fill="none" stroke={color} 
                  strokeWidth={strokeWidth} strokeDasharray={isSelected ? "none" : "4 3"} 
                  opacity={opacity} className="transition-all duration-500" 
                />
              );
            })}

            {(() => {
              const avgPoints = categories.map((cat, idx) => {
                const val = parseFloat(allMetrics[0].allCategoryAverages[cat]) || 0;
                const p = getPoint(val, idx, categories.length);
                return `${p.x},${p.y}`;
              }).join(" ");

              return (
                <g>
                  <polygon points={avgPoints} fill={themeColors[0].fill} stroke={themeColors[0].stroke} strokeWidth="2.5" className="transition-all duration-500" />
                  {categories.map((cat, idx) => {
                    const val = parseFloat(allMetrics[0].allCategoryAverages[cat]) || 0;
                    const p = getPoint(val, idx, categories.length);
                    return <circle key={`avg-c-${idx}`} cx={p.x} cy={p.y} r="3.5" fill="#ffffff" stroke={themeColors[0].stroke} strokeWidth="2" />;
                  })}
                </g>
              );
            })()}
          </g>
        )}

        {isCompareMode && (
          <g>
            {allMetrics.map((m, mIdx) => {
              const points = categories.map((cat, idx) => {
                const val = parseFloat(m.categoryAverages[cat]) || 0;
                const p = getPoint(val, idx, categories.length);
                return `${p.x},${p.y}`;
              }).join(" ");
              const theme = themeColors[mIdx % themeColors.length];
              
              return (
                <g key={`compare-${mIdx}`}>
                  <polygon points={points} fill={theme.fill} stroke={theme.stroke} strokeWidth="2.5" className="transition-all duration-500" />
                  {categories.map((cat, idx) => {
                    const val = parseFloat(m.categoryAverages[cat]) || 0;
                    const p = getPoint(val, idx, categories.length);
                    return <circle key={`c-${mIdx}-${idx}`} cx={p.x} cy={p.y} r="3.5" fill="#ffffff" stroke={theme.stroke} strokeWidth="2" className="transition-all duration-500" />;
                  })}
                </g>
              );
            })}
          </g>
        )}
        {labels}
      </svg>

      {!isCompareMode && allMetrics[0] && (
        <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center mt-4 bg-white/60 px-4 py-2 rounded-xl border border-slate-100">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-700">
            <span className="w-3.5 h-3.5 bg-indigo-500/30 border-2 border-indigo-600 rounded-sm"></span> 
            เฉลี่ยรวม (ช่วงที่เลือก)
          </div>
          {Array.from(new Set(allMetrics[0]?.rawData.map(r => r.Quarter))).sort().map((q, idx) => {
            const color = qColors[q] || "#94a3b8";
            return (
              <div key={idx} className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600">
                <span className="w-4 h-0 border-t-[2.5px] border-dashed" style={{ borderColor: color }}></span> 
                {q}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [data, setData] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [staffExpMap, setStaffExpMap] = useState({}); // เก็บข้อมูลประสบการณ์แต่ละคน
  
  const [availableQuarters, setAvailableQuarters] = useState([]);
  const [availableStartYears, setAvailableStartYears] = useState([]);
  
  // Selection States
  const [selectedStaffs, setSelectedStaffs] = useState([""]);
  const [selectedQuarter, setSelectedQuarter] = useState("All");
  const [selectedStartYear, setSelectedStartYear] = useState("All"); // ฟิลเตอร์ปีที่เริ่มงาน
  
  // Gemini API States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [aiError, setAiError] = useState("");

  const [showPrintHint, setShowPrintHint] = useState(false);

  // Firebase / Storage States
  const [saveStatus, setSaveStatus] = useState(""); 

  const fileInputRef = useRef(null);

  // Parse CSV
  const parseCSV = (csvText) => {
    const lines = csvText.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0);
    
    let headerRowIdx = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes("Name") && lines[i].includes("Design Skill")) {
        headerRowIdx = i;
        break;
      }
    }
    if (headerRowIdx === -1) { alert("ไม่พบโครงสร้างข้อมูล (Header) ที่ถูกต้องในไฟล์ CSV"); return []; }

    const headers = lines[headerRowIdx].split(',').map(h => h.trim());
    let dataStartIdx = headerRowIdx + 1;
    if (lines[dataStartIdx] && lines[dataStartIdx].includes("Column1")) { dataStartIdx++; }

    const parsedData = [];
    for (let i = dataStartIdx; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length < headers.length - 3) continue;

      const rowObj = {};
      headers.forEach((header, index) => {
        if (header) { rowObj[header] = values[index] || ""; }
      });
      if (rowObj["Name"]) { parsedData.push(rowObj); }
    }
    return parsedData;
  };

  // Demo data stays in memory for this browser tab only.
  useEffect(() => { setData(parseCSV(defaultCsvString)); }, []);

  // Update Filters Lists และคำนวณอายุงาน
  useEffect(() => {
    if (data.length > 0) {
      const uniqueStaff = [...new Set(data.map(item => item["Name"]))];
      setStaffList(uniqueStaff);
      
      const qSet = new Set();
      const sySet = new Set();
      const expMap = {};
      
      const evalBaseYear = new Date().getFullYear(); // ใช้ปี 2024 เป็นฐานคำนวณอายุงานเพื่อให้ตัวเลขสมเหตุสมผลกับ Data

      data.forEach(d => { 
        if (d.Quarter) qSet.add(d.Quarter); 
        if (d["Yrs Started"]) {
          sySet.add(d["Yrs Started"]);
          if (!expMap[d.Name]) {
            const startY = parseInt(d["Yrs Started"]);
            expMap[d.Name] = isNaN(startY) ? 0 : (evalBaseYear - startY); // คำนวณปีประสบการณ์
          }
        }
      });
      
      setAvailableQuarters(Array.from(qSet).sort());
      setAvailableStartYears(Array.from(sySet).sort((a,b) => b.localeCompare(a))); 
      setStaffExpMap(expMap);

      if (selectedStaffs.length === 1 && !selectedStaffs[0]) {
        setSelectedStaffs([uniqueStaff[0]]);
      }
    } else {
      setStaffList([]);
      setAvailableQuarters([]);
      setAvailableStartYears([]);
      setStaffExpMap({});
      setSelectedStaffs([""]);
    }
  }, [data]);

  useEffect(() => {
    setAiAnalysis("");
    setAiError("");
  }, [selectedStaffs, selectedQuarter, selectedStartYear]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target.result;
        const newData = parseCSV(text);
        if (newData.length > 0) {
          setData(newData);
          setSaveStatus("local");
        }
      };
      reader.readAsText(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const addStaff = () => {
    if (selectedStaffs.length < 6) {
      const available = staffList.find(s => !selectedStaffs.includes(s)) || staffList[0];
      setSelectedStaffs([...selectedStaffs, available]);
    }
  };
  const removeStaff = (indexToRemove) => {
    if (selectedStaffs.length > 1) {
      setSelectedStaffs(selectedStaffs.filter((_, idx) => idx !== indexToRemove));
    }
  };
  const updateStaff = (index, newValue) => {
    const newStaffs = [...selectedStaffs];
    newStaffs[index] = newValue;
    setSelectedStaffs(newStaffs);
  };

  // -------------------------------------------------------------
  // Data Calculation Helper
  // -------------------------------------------------------------
  const calculateMetrics = (staffName, quarterFilter, startYearFilter) => {
    const allStaffData = data.filter(item => item["Name"] === staffName);
    if (allStaffData.length === 0) return null;

    // กรองตาม ปีเริ่มงาน (Yrs Started)
    const yearData = startYearFilter === "All" 
      ? allStaffData 
      : allStaffData.filter(item => item["Yrs Started"] === startYearFilter);
    
    if (yearData.length === 0) return null;

    const allCategoryAverages = {};
    scoreCategories.forEach(cat => {
      let sum = 0, count = 0;
      yearData.forEach(row => {
        const val = parseFloat(row[cat]);
        if (!isNaN(val)) { sum += val; count++; }
      });
      allCategoryAverages[cat] = count > 0 ? (sum / count).toFixed(2) : 0;
    });

    const displayData = quarterFilter === "All" 
      ? yearData 
      : yearData.filter(item => item["Quarter"] === quarterFilter);

    if (displayData.length === 0) return null;

    let totalWeightedScore = 0;
    let totalWeightUsed = 0;
    const displayCategoryAverages = {};

    scoreCategories.forEach(cat => {
      let sum = 0, count = 0;
      displayData.forEach(row => {
        const val = parseFloat(row[cat]);
        if (!isNaN(val)) { sum += val; count++; }
      });
      
      const catAvg = count > 0 ? (sum / count) : 0;
      displayCategoryAverages[cat] = catAvg.toFixed(2);
      
      if (count > 0) {
        totalWeightedScore += catAvg * categoryWeights[cat];
        totalWeightUsed += categoryWeights[cat];
      }
    });

    const overallAverage = totalWeightUsed > 0 ? (totalWeightedScore / totalWeightUsed).toFixed(2) : 0;
    const expYears = staffExpMap[staffName] || 0; // ดึงอายุงานที่คำนวณไว้

    return {
      name: staffName,
      overallAverage,
      categoryAverages: displayCategoryAverages,
      allCategoryAverages,
      recordCount: displayData.length,
      team: yearData[0]["TEAM"] || "-",
      startYear: yearData[0]["Yrs Started"] || "-",
      expYears: expYears, // ส่งอายุงานไปแสดงผลและประมวลผล
      rawData: yearData, 
      displayData 
    };
  };

  const allMetrics = useMemo(() => {
    return selectedStaffs.map((name) => calculateMetrics(name, selectedQuarter, selectedStartYear)).filter(Boolean);
  }, [selectedStaffs, selectedQuarter, selectedStartYear, data]);
  
  const combinedTableData = useMemo(() => {
    let combined = [];
    allMetrics.forEach(m => combined = [...combined, ...m.displayData]);
    
    return combined.sort((a, b) => {
      if (a["Yrs Started"] !== b["Yrs Started"]) return b["Yrs Started"].localeCompare(a["Yrs Started"]);
      if (a.Quarter !== b.Quarter) return a.Quarter.localeCompare(b.Quarter);
      return a.Name.localeCompare(b.Name);
    });
  }, [allMetrics]);

  const isCompareMode = selectedStaffs.length > 1;

  const displayTimeText = useMemo(() => {
    if (selectedStartYear === "All" && selectedQuarter === "All") return "ภาพรวมทั้งหมด";
    if (selectedStartYear !== "All" && selectedQuarter === "All") return `เริ่มงานปี ${selectedStartYear}`;
    if (selectedStartYear === "All" && selectedQuarter !== "All") return `ไตรมาส ${selectedQuarter} (รวมทุกปี)`;
    return `${selectedQuarter} คนที่เริ่มงานปี ${selectedStartYear}`;
  }, [selectedStartYear, selectedQuarter]);

  // -------------------------------------------------------------
  // Gemini AI Integration
  // -------------------------------------------------------------
  const generateAIInsights = async () => {
    setAiError("เวอร์ชันทดลองยังไม่เชื่อมต่อ AI — ต้องตั้งค่า API ฝั่งเซิร์ฟเวอร์ก่อนใช้งาน");
  };

  const formatText = (text) => {
    return text.split('\n').map((line, index) => {
      const boldRegex = /\*\*(.*?)\*\*/g;
      let match, lastIndex = 0, elements = [];
      while ((match = boldRegex.exec(line)) !== null) {
        elements.push(line.substring(lastIndex, match.index));
        elements.push(<strong key={`${index}-${lastIndex}`} className="text-slate-900 font-bold">{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }
      elements.push(line.substring(lastIndex));
      return <p key={index} className="mb-2 leading-relaxed text-slate-700 min-h-[1.5rem]">{elements}</p>;
    });
  };

  const handlePrintClick = () => {
    try {
      window.print();
      setShowPrintHint(true);
      setTimeout(() => setShowPrintHint(false), 8000);
    } catch (err) {
      setShowPrintHint(true);
      setTimeout(() => setShowPrintHint(false), 8000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 md:p-8 print:p-0 print:bg-white relative">
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white; }
          @page { size: A4 portrait; margin: 12mm; }
          .shadow-sm, .shadow-lg { box-shadow: none !important; border: 1px solid #e2e8f0; }
          .print-avoid-break { page-break-inside: avoid; break-inside: avoid; }
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; page-break-after: auto; }
          thead { display: table-header-group; }
          tfoot { display: table-footer-group; }
        }
      `}</style>

      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 print:mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="text-indigo-600" size={32} />
            ระบบสรุปผลการประเมิน
          </h1>
          <p className="text-sm text-amber-700 mt-2">โหมดทดลอง • ข้อมูลเริ่มต้นเป็นข้อมูลสมมติ • CSV อยู่ในแท็บนี้เท่านั้น</p>
          <p className="text-slate-500 mt-1 print:hidden">วิเคราะห์และเปรียบเทียบผลคะแนนตามระดับประสบการณ์ (สูงสุด 6 คน)</p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 print:hidden">
          {saveStatus === "local" && (<span className="text-sm text-slate-500">โหลดในแท็บนี้แล้ว • ยังไม่บันทึกส่วนกลาง</span>)}
          {saveStatus === "saving" && (
            <div className="flex items-center gap-1.5 text-slate-500 text-[13px] font-medium mr-2 bg-slate-100 px-3 py-1.5 rounded-full">
              <Loader2 size={14} className="animate-spin" /> กำลังซิงก์ข้อมูล...
            </div>
          )}
          {saveStatus === "saved" && (
            <div className="flex items-center gap-1.5 text-emerald-600 text-[13px] font-medium mr-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
              <Cloud size={16} /> บันทึกล่าสุดแล้ว
            </div>
          )}
          {saveStatus === "error" && (
            <div className="flex items-center gap-1.5 text-red-600 text-[13px] font-medium mr-2 bg-red-50 px-3 py-1.5 rounded-full border border-red-200">
              <AlertCircle size={16} /> ซิงก์ไม่สำเร็จ
            </div>
          )}

          <button onClick={handlePrintClick} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-lg cursor-pointer transition-colors shadow-sm font-medium">
            <Printer size={18} /> <span>พิมพ์ / Save PDF</span>
          </button>
          <div>
            <input type="file" accept=".csv" ref={fileInputRef} onChange={handleFileUpload} className="hidden" id="csv-upload" />
            <label htmlFor="csv-upload" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg cursor-pointer transition-colors shadow-sm font-medium">
              <Upload size={18} /> <span>อัปโหลดไฟล์ .CSV</span>
            </label>
          </div>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="max-w-7xl mx-auto bg-white p-10 rounded-2xl shadow-sm text-center">
          <FileSpreadsheet className="mx-auto text-slate-300 mb-4" size={64} />
          <p className="text-lg text-slate-500">ไม่มีข้อมูล กรุณาอัปโหลดไฟล์ CSV</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* Left Sidebar (Config & Scores) */}
          <div className="space-y-6 xl:col-span-4 lg:col-span-12">
            
            {/* Control Panel Card - ป้องกันคร่อมหน้า */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-all print-avoid-break">
              <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4 print:hidden">
                เลือกบุคลากรเปรียบเทียบประสบการณ์
              </label>
              <label className="hidden text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4 print:block border-b border-slate-200 pb-2">
                รายชื่อบุคลากรที่วิเคราะห์
              </label>

              {/* Dynamic Dropdowns for 1-6 Staff */}
              <div className="space-y-3">
                {selectedStaffs.map((staff, idx) => (
                  <div key={idx} className="flex items-center gap-2 relative">
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl z-10" style={{ backgroundColor: themeColors[idx].stroke }}></div>
                    <select 
                      className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-5 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:border-transparent font-medium text-sm print:appearance-none print:border-none print:bg-transparent print:pl-4 print:py-1 print:font-bold print:text-[15px]"
                      style={{ outlineColor: themeColors[idx].stroke }}
                      value={staff}
                      onChange={(e) => updateStaff(idx, e.target.value)}
                    >
                      {staffList.map((name, i) => (
                        // เพิ่มจำนวนปีประสบการณ์ในตัวเลือก
                        <option key={i} value={name}>{name} (ประสบการณ์ {staffExpMap[name]} ปี)</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-9 top-3 text-slate-400 pointer-events-none print:hidden" size={18} />
                    
                    {idx > 0 && (
                      <button onClick={() => removeStaff(idx)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors print:hidden" title="นำออก">
                        <X size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {selectedStaffs.length < 6 && (
                <button onClick={addStaff} className="w-full mt-3 flex items-center justify-center gap-1.5 py-2 border-2 border-dashed border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-300 transition-colors text-sm font-semibold print:hidden">
                  <Plus size={16} /> <span>เพิ่มบุคคลเพื่อเปรียบเทียบ</span>
                </button>
              )}

              {/* Filters */}
              <div className="mt-6 pt-5 border-t border-slate-100 print:hidden">
                <div className="grid grid-cols-2 gap-4">
                  {/* Start Year Dropdown */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar size={16} className="text-slate-400" /> ปีที่เริ่มงาน
                    </label>
                    <div className="relative">
                      <select 
                        className="w-full appearance-none bg-blue-50/50 border border-blue-100 text-slate-800 rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent font-medium text-sm"
                        value={selectedStartYear} onChange={(e) => setSelectedStartYear(e.target.value)}
                      >
                        <option value="All">ทั้งหมด</option>
                        {availableStartYears.map((y, idx) => (<option key={idx} value={y}>{y}</option>))}
                      </select>
                      <ChevronDown className="absolute right-3 top-3 text-blue-400 pointer-events-none" size={18} />
                    </div>
                  </div>

                  {/* Quarter Dropdown */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar size={16} className="text-slate-400" /> ไตรมาส
                    </label>
                    <div className="relative">
                      <select 
                        className="w-full appearance-none bg-blue-50/50 border border-blue-100 text-slate-800 rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent font-medium text-sm"
                        value={selectedQuarter} onChange={(e) => setSelectedQuarter(e.target.value)}
                      >
                        <option value="All">ทั้งหมด</option>
                        {availableQuarters.map((q, idx) => (<option key={idx} value={q}>{q}</option>))}
                      </select>
                      <ChevronDown className="absolute right-3 top-3 text-blue-400 pointer-events-none" size={18} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Overall Score Cards */}
            {allMetrics.length > 0 && (
              <div className={`grid gap-4 print-avoid-break ${allMetrics.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
                {allMetrics.map((m, idx) => {
                  const theme = themeColors[idx % themeColors.length];
                  return (
                    <div key={idx} className={`bg-gradient-to-br ${theme.gradient} p-5 rounded-2xl shadow-lg text-white relative overflow-hidden animate-in fade-in zoom-in-95`}>
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2 opacity-90 border-b border-white/20 pb-2">
                          <div className="flex items-center gap-1.5"><Users size={16} /><h3 className="font-medium text-[11px]">คะแนนรวม</h3></div>
                          {/* ป้ายแสดงจำนวนประสบการณ์แบบเด่นๆ บนการ์ด */}
                          <div className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-bold">
                            <Clock size={12} /> {m.expYears} ปี
                          </div>
                        </div>
                        <div className="text-[11px] font-bold inline-block text-white mb-2 truncate max-w-[140px]" title={m.name}>{m.name.split(' ')[0]}</div>
                        <div className="flex items-end gap-1.5">
                          <span className={`font-extrabold tracking-tight ${allMetrics.length > 2 ? 'text-3xl' : 'text-5xl'}`}>
                            {m.overallAverage}
                          </span>
                          <span className="text-white/80 text-sm font-medium mb-1">/ 10</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            {/* Gemini AI Trigger Button */}
            <div className="print:hidden">
              <button
                onClick={generateAIInsights} disabled={isAnalyzing || allMetrics.length === 0}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white px-6 py-3.5 rounded-xl font-bold shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
                <span>{isAnalyzing ? "กำลังวิเคราะห์ข้อมูล..." : (isCompareMode ? `✨ AI เทียบประสิทธิภาพ vs ประสบการณ์` : "✨ AI วิเคราะห์ข้อมูล")}</span>
              </button>
            </div>

            {/* Weight Note Panel */}
            <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-100 shadow-sm print-avoid-break">
              <div className="flex items-center gap-2 mb-2.5">
                <Info size={16} className="text-indigo-600" />
                <h4 className="text-sm font-bold text-indigo-800">หมายเหตุ: น้ำหนักการคำนวณคะแนน</h4>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 text-[11px] font-medium text-slate-600">
                <li className="flex justify-between px-1 border-b border-indigo-100/50 pb-1 sm:border-0 sm:pb-0"><span>Design Skill</span> <span className="text-indigo-600 font-bold">20%</span></li>
                <li className="flex justify-between px-1 border-b border-indigo-100/50 pb-1 sm:border-0 sm:pb-0"><span>Management</span> <span className="text-indigo-600 font-bold">20%</span></li>
                <li className="flex justify-between px-1 border-b border-indigo-100/50 pb-1 sm:border-0 sm:pb-0"><span>Final Product</span> <span className="text-indigo-600 font-bold">20%</span></li>
                <li className="flex justify-between px-1 border-b border-indigo-100/50 pb-1 sm:border-0 sm:pb-0"><span>Working Attitude</span> <span className="text-indigo-600 font-bold">10%</span></li>
                <li className="flex justify-between px-1 border-b border-indigo-100/50 pb-1 sm:border-0 sm:pb-0"><span>Development</span> <span className="text-indigo-600 font-bold">10%</span></li>
                <li className="flex justify-between px-1 border-b border-indigo-100/50 pb-1 sm:border-0 sm:pb-0"><span>Maturity & Lead.</span> <span className="text-indigo-600 font-bold">10%</span></li>
                <li className="flex justify-between px-1 border-b border-indigo-100/50 pb-1 sm:border-0 sm:pb-0"><span>Innovative</span> <span className="text-indigo-600 font-bold">5%</span></li>
                <li className="flex justify-between px-1"><span>Corp. Awareness</span> <span className="text-indigo-600 font-bold">5%</span></li>
              </ul>
            </div>
          </div>

          {/* Right Area: Detailed Analytics */}
          {allMetrics.length === 0 ? (
            <div className="xl:col-span-8 lg:col-span-12 bg-white rounded-2xl shadow-sm border border-slate-100 p-10 flex flex-col items-center justify-center text-center">
              <FileSpreadsheet className="text-slate-300 mb-4" size={56} />
              <h3 className="text-xl font-bold text-slate-700 mb-1">ไม่มีข้อมูลในเงื่อนไขที่เลือก</h3>
              <p className="text-slate-500">บุคลากรที่เลือกอาจไม่มีข้อมูลประเมินในปีหรือไตรมาสนี้</p>
            </div>
          ) : (
            <div className="xl:col-span-8 lg:col-span-12 space-y-8">
              
              {/* Charts Area */}
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 relative print-avoid-break">
                <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="text-indigo-600" size={24} />
                    <h2 className="text-xl font-bold text-slate-800">
                      {isCompareMode ? "เปรียบเทียบคะแนนแยกตามหมวดหมู่" : "คะแนนแยกตามหมวดหมู่"}
                    </h2>
                  </div>
                  <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full">
                    {displayTimeText}
                  </span>
                </div>
                
                <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-stretch">
                  {/* Spider Web Graph (Radar Chart) */}
                  <div className="w-full lg:w-5/12 flex flex-col items-center justify-center py-4 bg-slate-50/50 rounded-2xl border border-slate-50">
                    <div className="w-full max-w-[340px]">
                      <RadarChart 
                        categories={scoreCategories}
                        allMetrics={allMetrics}
                        selectedQuarter={selectedQuarter}
                      />
                    </div>
                  </div>
                  
                  {/* Bar Charts (รองรับหลายคน วางซ้อนกัน) */}
                  <div className="w-full lg:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 content-center">
                    {scoreCategories.map((category, idx) => (
                      <div key={idx} className="relative bg-slate-50/50 p-3 rounded-xl border border-slate-100/50">
                        <div className="mb-3 border-b border-slate-200 pb-1 flex justify-between">
                          <span className="text-sm font-bold text-slate-700">{formatCategoryName(category)}</span>
                          <span className="text-[10px] font-bold text-slate-400 bg-white px-1.5 rounded-md border border-slate-200">{categoryWeights[category]*100}%</span>
                        </div>
                        
                        {/* วาด Bar Chart สำหรับคนที่ถูกเลือกทุกคน */}
                        <div className="space-y-2">
                          {allMetrics.map((m, mIdx) => {
                            const score = parseFloat(m.categoryAverages[category]) || 0;
                            const pct = (score / 10) * 100;
                            const theme = themeColors[mIdx % themeColors.length];
                            
                            return (
                              <div key={`bar-${mIdx}`} className="flex items-center gap-2 group">
                                {isCompareMode && (
                                  <span className="text-[10px] font-medium text-slate-500 w-16 truncate" title={m.name}>
                                    {m.name.split(' ')[0]} <span className="text-[9px] text-slate-400">({m.expYears}ปี)</span>
                                  </span>
                                )}
                                <div className="h-1.5 flex-1 bg-slate-200 rounded-full overflow-hidden">
                                  <div className={`h-full ${theme.bg} rounded-full transition-all duration-700 ease-out`} style={{ width: `${pct}%` }}></div>
                                </div>
                                <span className={`text-[11px] font-bold w-5 text-right ${theme.text}`}>{score.toFixed(1)}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Insights Result Box */}
              {(aiAnalysis || aiError) && (
                <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 p-6 md:p-8 rounded-2xl shadow-sm border border-violet-100 animate-in fade-in slide-in-from-bottom-4 duration-500 print-avoid-break">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-violet-800">
                      <Sparkles size={24} className="text-violet-600" />
                      <h2 className="text-xl font-bold">{isCompareMode ? "✨ AI สรุปเปรียบเทียบประสิทธิภาพ vs ประสบการณ์" : "✨ AI Performance Insights"}</h2>
                    </div>
                    <span className="bg-white/60 text-violet-700 text-xs font-bold px-2.5 py-1 rounded-md border border-violet-200 print:hidden">
                      {displayTimeText}
                    </span>
                  </div>
                  
                  {aiError ? (
                    <div className="flex items-start gap-3 bg-red-50 text-red-700 p-4 rounded-xl"><AlertCircle size={20} className="mt-0.5" /><p>{aiError}</p></div>
                  ) : (
                    <div className="prose prose-slate prose-violet max-w-none text-slate-700 text-[14px]">
                      {formatText(aiAnalysis)}
                    </div>
                  )}
                </div>
              )}

              {/* Quarter Details Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center print-avoid-break">
                  <h2 className="text-lg font-bold text-slate-800">รายละเอียดคะแนน</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider">
                        {/* ปรับคอลัมน์ให้อ่านง่าย มีบอกทั้งปีเริ่มงานและประสบการณ์ */}
                        <th className="p-3 font-semibold whitespace-nowrap">เริ่มปี</th>
                        <th className="p-3 font-semibold whitespace-nowrap text-indigo-600">ประสบการณ์</th>
                        <th className="p-3 font-semibold whitespace-nowrap">Qtr</th>
                        {isCompareMode && <th className="p-3 font-semibold whitespace-nowrap">Name</th>}
                        {scoreCategories.map((cat, idx) => (
                          <th key={idx} className="p-3 font-semibold whitespace-nowrap text-center max-w-[80px] truncate" title={formatCategoryName(cat)}>
                            {formatCategoryName(cat).substring(0, 8)}..
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {combinedTableData.map((row, idx) => {
                        const colorIdx = selectedStaffs.indexOf(row.Name);
                        const theme = colorIdx !== -1 ? themeColors[colorIdx % themeColors.length] : themeColors[0];
                        const exp = staffExpMap[row.Name];
                        
                        return (
                          <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-3 font-bold text-slate-400">{row["Yrs Started"]}</td>
                            <td className="p-3 font-extrabold text-indigo-600">{exp} ปี</td>
                            <td className="p-3 font-bold text-slate-700">{row["Quarter"]}</td>
                            {isCompareMode && (
                              <td className="p-3 font-medium whitespace-nowrap max-w-[120px] truncate" title={row["Name"]}>
                                <span className={`${theme.text} ${theme.border} ${theme.lightBg} border px-2 py-0.5 rounded shadow-sm`}>
                                  {row["Name"].split(' ')[0]}
                                </span>
                              </td>
                            )}
                            {scoreCategories.map((cat, idx2) => (
                              <td key={idx2} className="p-3 text-center font-medium text-slate-600">{row[cat] || "-"}</td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}
        </div>
      )}

      {/* Print Hint Toast */}
      {showPrintHint && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-6 py-4 rounded-xl shadow-2xl z-50 flex items-start gap-3 max-w-md animate-in fade-in slide-in-from-bottom-8 print:hidden">
          <Info className="text-blue-400 shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="font-bold mb-1 text-white">ไม่เห็นหน้าต่าง Print ใช่ไหม?</h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              เนื่องจากข้อจำกัดของระบบ Preview การกดปุ่มอาจไม่ทำงาน <br/>
              💡 <b>วิธีแก้:</b> ให้คลิกที่พื้นที่ว่างบน Dashboard 1 ครั้ง แล้วกดปุ่ม <kbd className="bg-slate-700 px-1.5 py-0.5 rounded text-white border border-slate-600 font-sans text-xs">Ctrl + P</kbd> (หรือ <kbd className="bg-slate-700 px-1.5 py-0.5 rounded text-white border border-slate-600 font-sans text-xs">Cmd + P</kbd> บน Mac) เพื่อสั่ง Print / Save PDF แทนครับ
            </p>
          </div>
          <button onClick={() => setShowPrintHint(false)} className="text-slate-400 hover:text-white shrink-0">
            <X size={18} />
          </button>
        </div>
      )}
    </div>
  );
}