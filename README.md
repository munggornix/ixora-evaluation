# IX | FLIX Evaluation — เวอร์ชันทดลอง

ดัดแปลงจากหน้าตาที่ผู้ใช้ให้มา ใช้ React + Vite + Tailwind

## เปิดในเครื่อง

ต้องมี Node.js 22 และ npm

```sh
npm install
npm run dev
```

สร้างไฟล์เว็บด้วย `npm run build`

## เปิดบน GitHub Pages

1. นำไฟล์ทั้งหมดในโฟลเดอร์นี้ รวม `.github` ขึ้น repository
2. Settings → Pages → Source: GitHub Actions
3. Actions → Deploy evaluation demo → Run workflow
4. ลิงก์เว็บจะแสดงใน deployment เมื่อสำเร็จ

คู่มือ: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

## ขอบเขต

- มี Dashboard, เปรียบเทียบพนักงาน, นำเข้า CSV, พิมพ์ PDF
- ข้อมูลเริ่มต้นเป็นข้อมูลสมมติ ชื่อจริงจากต้นฉบับไม่รวมอยู่ในโปรเจกต์นี้
- CSV ที่นำเข้าอยู่ในหน่วยความจำของแท็บ รีโหลดแล้วกลับเป็นตัวอย่าง ไม่มีฐานข้อมูลหรือการบันทึกถาวร
- ปุ่ม AI แสดงสถานะว่ายังไม่ได้เชื่อมต่อ ไม่ส่งข้อมูลออกไป
- ยังไม่มีฟอร์มกรอกผลประเมิน บัญชีผู้ใช้ หรือสิทธิ์ HR/หัวหน้า/พนักงาน
- ก่อนใช้งานจริงต้องเพิ่มระบบยืนยันตัวตน สิทธิ์ และฐานข้อมูล พร้อม API ฝั่งเซิร์ฟเวอร์สำหรับ AI
- การคำนวณและ parser CSV ยังคงมาจากต้นฉบับ ควรทดสอบเพิ่มเติมก่อนใช้กับข้อมูลจริง โดยเฉพาะช่องที่มี comma/quoted fields หรือคะแนนขาดหาย

ไฟล์ต้นฉบับไม่ถูกแก้ไข
