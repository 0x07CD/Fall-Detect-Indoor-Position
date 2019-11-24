# Fall Detection and Patient Surveillance using BLE
This project was developed with fall detection. And specify the location of patients in the hospital

Wearable Device คือ อุปกรณ์ลักษณะเป็นสายลัดข้อมือ ใช้สำหรับตรวจจับการหกล้ม และระบุตำแหน่งของผู้สวมใส่ โดยอุปกรณ์นี้มีหน้าที่หลักคือ ทำหน้าที่ปล่อยสัญญาณ Beacon
เป็นระยะๆ เพื่อนำไปใช้ในการระบุตำแหน่ง และขณะเดียวกันก็ทำการคำนวณค่าที่ได้จากเซ็นเซอร์เพื่อตรวจเช็คว่าในขณะนั้นผู้สวมใส่หกล้มหรือไม่ หากคำนวณแล้วเป็นการหกล้ม อุปกรณ์
นี้จะส่งการแจ้งเตือนไปยังเครื่องเซิร์ฟเวอร์หลัก เพื่อทำการแจ้งเตือนให้พยาบาลหรือเจ้าหน้าที่ทราบ และสามารถมาช่วยคนไข้ได้ทัน

Reference Node คือ อุปกรณ์สำหรับใช้ในการระบุตำแหน่ง ซึ่งตัวอุปกรณ์ที่มีบทบาทเป็น Reference Node จะถูกติดตั้งอยู่ภายในอาคารที่ต้องการจะให้มีการระบุตำแหน่ง จากนั้นจะคอยรับสัญญาณ Beacon จาก Wearable Device แล้วส่งไปให้กับเครื่องเซิร์ฟเวอร์หลัก เพื่อนำไปทำการคำนวณหาตำแหน่งของ Wearable Device ต่อไป

Locator คือ อุปกรณ์ที่ทำหน้าที่เป็นเครื่องหลักในการประมาณผลหาตำแหน่งของ Wearable Device ซึ่งถูกส่งข้อมูลจาก Reference Node ตามจุดต่างๆ แล้วนำไปแสดงผล
และยังทำหน้าที่คอยรับแจ้งเตือนเมื่อเกิดเหตุหกล้ม โดยจะมีการส่งสัญญาณมาจาก Wearable Device แล้วนำไปแจ้งเตือนให้พยาบาล หรือผู้ดูแลผู้ป่วย โดยอุปกรณ์นี้จะติดตั้งอยู่
ภายในห้องของพยาบาลหรือห้องของผู้ที่คอยดูแลผู้ป่วย
