import qrcode from "qrcode"

const requestQr = (data = '') => {
    const code = qrcode.toDataURL(JSON.stringify(data), { errorCorrectionLevel: 'H' })
    return code
}

export default requestQr