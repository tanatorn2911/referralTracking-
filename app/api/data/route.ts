import { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";
import { NextResponse } from "next/server";
import { format } from "date-fns-tz";


let cachedData: any[] | null = null;

export async function getSheetData() {
    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        },
        scopes: [
            "https://www.googleapis.com/auth/drive",
            "https://www.googleapis.com/auth/drive.file",
            "https://www.googleapis.com/auth/spreadsheets",
        ],
    });

    const sheets = google.sheets({
        auth,
        version: "v4",
    });

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: "A2:D", //ชื่อชีท
    });

    cachedData = response.data.values || [];
    return cachedData;
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return NextResponse.json({ message: "Only POST requests are allowed" });
    }

    try {
        let passedValue = await new Response(req.body).text();
        let bodyreq = JSON.parse(passedValue);
        const { name, merchantId } = bodyreq;
        
        
        const timeZone = 'Asia/Bangkok';
        const currentTimestamp = new Date();
        const timestamp = format(currentTimestamp, "yyyy-MM-dd  HHH:mm:ss", { timeZone });
        console.log("ttttt",bodyreq);
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
            },
            scopes: [
                "https://www.googleapis.com/auth/drive",
                "https://www.googleapis.com/auth/drive.file",
                "https://www.googleapis.com/auth/spreadsheets",
            ],
        });

        const sheets = google.sheets({
            auth,
            version: "v4",
        });

        const response = await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: "A1:D1",
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [[name, merchantId, timestamp]],
            },
        });

        // หลังจากเพิ่มข้อมูลลงใน Google Sheets คุณต้องอัปเดตแคชเพื่อให้ข้อมูลในแคชเป็นข้อมูลล่าสุด
        cachedData = await getSheetData();

        return NextResponse.json({ data: response.data });
    } catch (e) {
        console.error("Error processing request", e);
        return NextResponse.json({ error: "Internal Server Error" });
    }
}

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return NextResponse.json({ message: "Only GET requests are allowed" });
    }

    try {
        const data = await getSheetData(); // ให้ดึงข้อมูลจาก Google Sheets API ทุกครั้งที่มีการเรียกใช้ API

        return NextResponse.json({ data: data });
    } catch (e) {
        console.error("Error fetching data", e);
        return NextResponse.json({ error: "Internal Server Error" });
    }
}

export async function PUT(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "PUT") {
        return NextResponse.json({ message: "Only PUT requests are allowed" });
    }

    try {
        let passedValue = await new Response(req.body).text();
        let bodyreq = JSON.parse(passedValue);

        const { timestamp,newStaffID,newMerchantID, newTimeStamp } = bodyreq; // เปลี่ยนตรงนี้
console.log("body req",bodyreq);

        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
            },
            scopes: [
                "https://www.googleapis.com/auth/drive",
                "https://www.googleapis.com/auth/drive.file",
                "https://www.googleapis.com/auth/spreadsheets",
            ],
        });

        const sheets = google.sheets({
            auth,
            version: "v4",
        });

        const sheetData = await getSheetData(); 
        const rowToUpdate = sheetData.findIndex(row => row[2] === timestamp);

        if (rowToUpdate === -1) {
            return NextResponse.json({ error: "Data not found" });
        }

        const response = await sheets.spreadsheets.values.update({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: `A${rowToUpdate + 2}:C${rowToUpdate + 2}`,
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [[newStaffID,newMerchantID,newTimeStamp]],
            },
        });

        cachedData = await getSheetData();

        return NextResponse.json({ data: response.data });
    } catch (e) {
        console.error("Error updating data", e);
        return NextResponse.json({ error: "Internal Server Error" });
    }
}


export async function DELETE(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "DELETE") {
        return NextResponse.json({ message: "Only DELETE requests are allowed" });
    }

    try {
        let passedValue = await new Response(req.body).text();
        let bodyreq = JSON.parse(passedValue);
        console.log('bodyreq',bodyreq)
        const { timestamp, id } = bodyreq;
        console.log('timestamp',timestamp)

     

        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
            },
            scopes: [
                "https://www.googleapis.com/auth/drive",
                "https://www.googleapis.com/auth/drive.file",
                "https://www.googleapis.com/auth/spreadsheets",
            ],
        });

        const sheets = google.sheets({
            auth,
            version: "v4",
        });

        const sheetData = await getSheetData(); // ให้ดึงข้อมูลจาก Google Sheets API ทุกครั้งที่มีการเรียกใช้ API
        console.log('sheetData',sheetData)
        const rowToDelete = sheetData.findIndex((row) => row[2] === id);

        if (rowToDelete === -1) {
            return NextResponse.json({ error: "Data not found" });
        }

        const response = await sheets.spreadsheets.batchUpdate({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            requestBody: {
                requests: [
                    {
                        deleteDimension: {
                            range: {
                                sheetId: 0,
                                dimension: "ROWS",
                                startIndex: rowToDelete + 1,
                                endIndex: rowToDelete + 2,
                            },
                        },
                    },
                ],
            },
        });

        // หลังจากลบข้อมูลออกจาก Google Sheets คุณต้องอัปเดตแคชเพื่อให้ข้อมูลในแคชเป็นข้อมูลล่าสุด
        cachedData = await getSheetData();

        return NextResponse.json({ data: response.data });
    } catch (e) {
        console.error("Error deleting data", e);
        return NextResponse.json({ error: "Internal Server Error" });
    }
}
