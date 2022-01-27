function RatajXY (UholStupne: number, DialkaCm: number) {
    XSuradnica = Math.cos(UholStupne * 3.141 / 180) * DialkaCm
    YSuradnica = Math.sin(UholStupne * 3.141 / 180) * DialkaCm
}
input.onButtonPressed(Button.A, function () {
    radio.sendString("snimaj")
    Cas_Prijmu = 0
})
function Kresli_Pozadie () {
    LCD1IN8.DrawRectangle(
    0,
    0,
    160,
    128,
    LCD1IN8.Get_Color(LCD_COLOR.BLACK),
    DRAW_FILL.DRAW_FULL,
    DOT_PIXEL.DOT_PIXEL_1
    )
    LCD1IN8.DisString(
    30,
    0,
    "FILIPKOV RADAR",
    LCD1IN8.Get_Color(LCD_COLOR.GBLUE)
    )
    LCD1IN8.DrawCircle(
    80,
    128,
    77,
    LCD1IN8.Get_Color(LCD_COLOR.BLUE),
    DRAW_FILL.DRAW_FULL,
    DOT_PIXEL.DOT_PIXEL_1
    )
    LCD1IN8.DrawCircle(
    80,
    128,
    77,
    LCD1IN8.Get_Color(LCD_COLOR.WHITE),
    DRAW_FILL.DRAW_EMPTY,
    DOT_PIXEL.DOT_PIXEL_1
    )
    LCD1IN8.DrawCircle(
    80,
    128,
    50,
    LCD1IN8.Get_Color(LCD_COLOR.WHITE),
    DRAW_FILL.DRAW_EMPTY,
    DOT_PIXEL.DOT_PIXEL_1
    )
    LCD1IN8.DrawCircle(
    80,
    127,
    20,
    LCD1IN8.Get_Color(LCD_COLOR.WHITE),
    DRAW_FILL.DRAW_EMPTY,
    DOT_PIXEL.DOT_PIXEL_1
    )
    LCD1IN8.DrawLine(
    18,
    82,
    80,
    128,
    LCD1IN8.Get_Color(LCD_COLOR.WHITE),
    DOT_PIXEL.DOT_PIXEL_1,
    LINE_STYLE.LINE_SOLID
    )
    LCD1IN8.DrawLine(
    80,
    50,
    80,
    128,
    LCD1IN8.Get_Color(LCD_COLOR.WHITE),
    DOT_PIXEL.DOT_PIXEL_1,
    LINE_STYLE.LINE_SOLID
    )
    LCD1IN8.DrawLine(
    144,
    84,
    80,
    128,
    LCD1IN8.Get_Color(LCD_COLOR.WHITE),
    DOT_PIXEL.DOT_PIXEL_1,
    LINE_STYLE.LINE_SOLID
    )
}
input.onButtonPressed(Button.B, function () {
    IndexUhol = 0
    IndexDialka = 0
    Cas_Prijmu = 0
    Uhly = []
    Dialky = []
})
radio.onReceivedValue(function (name, value) {
    if (name == "uhol") {
        Uhly.insertAt(IndexUhol, value)
        IndexUhol += 1
        Cas_Prijmu = input.runningTime()
    }
    if (name == "dialka") {
        Dialky.insertAt(IndexDialka, value)
        IndexDialka += 1
        Cas_Prijmu = input.runningTime()
    }
})
function Reset () {
    IndexDialka = 0
    IndexUhol = 0
    Cas_Prijmu = input.runningTime()
    Uhly = []
    Dialky = []
}
let XDisp = 0
let YDisp = 0
let Dialky: number[] = []
let Uhly: number[] = []
let IndexDialka = 0
let IndexUhol = 0
let Cas_Prijmu = 0
let YSuradnica = 0
let XSuradnica = 0
LCD1IN8.LCD_Init()
LCD1IN8.LCD_Clear()
LCD1IN8.LCD_Filling(LCD1IN8.Get_Color(LCD_COLOR.BLACK))
LCD1IN8.LCD_SetBL(6)
Kresli_Pozadie()
LCD1IN8.LCD_Display()
radio.setGroup(1)
let MinDlzka = 15
let PocetKrokov = 30
let Max_Dlzka_Cm = 120
basic.forever(function () {
    if (input.runningTime() - Cas_Prijmu > 3000) {
        Reset()
    }
    if (IndexUhol >= PocetKrokov || IndexDialka >= PocetKrokov) {
        LCD1IN8.LCD_Clear()
        Kresli_Pozadie()
        for (let _index = 0; _index <= PocetKrokov - 1; _index++) {
            if (Uhly.length > _index && Dialky.length > _index) {
                if (Dialky[_index] < Max_Dlzka_Cm && Dialky[_index] > MinDlzka) {
                    RatajXY(Uhly[_index], Dialky[_index])
                    YDisp = pins.map(
                    YSuradnica,
                    0,
                    Max_Dlzka_Cm,
                    0,
                    128
                    )
                    XDisp = pins.map(
                    Math.abs(XSuradnica),
                    0,
                    Max_Dlzka_Cm,
                    0,
                    80
                    )
                    if (Uhly[_index] > 90) {
                        LCD1IN8.DrawCircle(
                        80 - XDisp,
                        128 - YDisp,
                        8,
                        LCD1IN8.Get_Color(LCD_COLOR.RED),
                        DRAW_FILL.DRAW_FULL,
                        DOT_PIXEL.DOT_PIXEL_1
                        )
                    } else {
                        LCD1IN8.DrawCircle(
                        80 + XDisp,
                        128 - YDisp,
                        8,
                        LCD1IN8.Get_Color(LCD_COLOR.RED),
                        DRAW_FILL.DRAW_FULL,
                        DOT_PIXEL.DOT_PIXEL_1
                        )
                    }
                }
            }
        }
        LCD1IN8.LCD_Display()
        IndexUhol = 0
        IndexDialka = 0
    }
})
