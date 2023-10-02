const express=require('express')
const pdfDocument=require('node-fpdf')
const app=express()


app.listen(1111,()=>{
    console.log("Server working!!!!!!!!!!!!!!!!!")
})

// fpdf
app.get('/simplestatic',async(req,res)=>{
    const doc = new pdfDocument('p','mm','A4')
    let outFile=Date.now()+" output file.pdf"
    doc.AddPage()
    doc.Image('C:/Users/ADMIN/Pictures/razak.png',5,50,45,45)
    doc.SetFont("Arial","B",14)//.Text('Invoice', { align: 'center' });
    doc.Rect(5,100,45,10);
    doc.Text(6,108,'Description')
    doc.Rect(57,100,45,10);
    doc.Text(58,108,'Quantity')
    doc.Rect(109,100,45,10);
    doc.Text(110,108,'Price')
    doc.Rect(161,100,45,10);
    doc.Text(162,108,'Total')

    doc.Output('F',outFile)

    await sleep(1000)

    res.download(outFile,()=>{
        console.log("Invoice generated")
    })
})

const sleep=(ms)=>{
    return new Promise((resolve)=>{
        setTimeout(resolve,ms)
    })
}