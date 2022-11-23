function Box1 () {
    Forward(Speed, 300)
    Track_Time(Acc_Speed, 600)
    Track_JC(Speed, 100)
    Turn_Right()
    Backward_Balance()
    Track_Time(Acc_Speed, 400)
    Track_JC(Speed, 100)
    Turn_Right()
    Backward_Balance()
    Track_JC(Speed, 100)
    Turn_Right()
    Backward_Balance()
    Track_JC(Speed, 100)
    Turn_Left()
    Backward_Balance()
    Track_JC(Speed, 100)
    Kick()
}
function Turn_Right () {
    Motor_Stop()
    MyRobotBit.Rotate(Turn.Right, Turn_Speed, Turn_Right_ms)
    Motor_Stop()
}
function Forward (Motor_Speed: number, Time: number) {
    Tune_Motor(Motor_Speed)
    MyRobotBit.MotorAB(motorDIR.Forward, Left_Speed, Right_Speed)
    basic.pause(Time)
}
function Tune_Motor (Motor_Speed: number) {
    Error = 0
    Integral = 0
    Pre_Error = 0
    Kp = 15
    Kd = 30
    Ki = 0
    Max_Speed = Motor_Speed
    if (Motor_Speed <= 70) {
        Left_Speed = Motor_Speed - 0
        Right_Speed = Motor_Speed - 6
    } else {
        Left_Speed = Motor_Speed - 0
        Right_Speed = Motor_Speed - 0
    }
}
function Track_JC (Motor_Speed: number, Time: number) {
    Forward(Motor_Speed, 1)
    Cal_Error()
    while (Error < 100) {
        Track_PID()
        Cal_Error()
    }
    Balance()
    Backward(Motor_Speed, Time)
}
input.onButtonPressed(Button.A, function () {
    OLED.init(128, 64)
    OLED.clear()
    Read_4_Analog()
    OLED.writeString("L2 = ")
    OLED.writeNum(MySensor.analogRead(MySensor.analogPort.P0))
    OLED.newLine()
    OLED.writeString("L1 = ")
    OLED.writeNum(MySensor.analogRead(MySensor.analogPort.P1))
    OLED.newLine()
    OLED.writeString("R1 = ")
    OLED.writeNum(MySensor.analogRead(MySensor.analogPort.P2))
    OLED.newLine()
    OLED.writeString("R2 = ")
    OLED.writeNum(MySensor.analogRead(MySensor.analogPort.P3))
    OLED.newLine()
    Read_2_Analog()
    OLED.writeString("BL = ")
    OLED.writeNum(MySensor.analogRead(MySensor.analogPort.P4))
    OLED.newLine()
    OLED.writeString("BR = ")
    OLED.writeNum(MySensor.analogRead(MySensor.analogPort.P10))
    OLED.newLine()
    basic.pause(500)
})
function UTurn () {
    Motor_Stop()
    MyRobotBit.Rotate(Turn.Right, Turn_Speed, Uturn_ms)
    Motor_Stop()
}
function Read_2_Analog () {
    BL = MySensor.analogRead(MySensor.analogPort.P4)
    BR = MySensor.analogRead(MySensor.analogPort.P10)
}
function Turn_Left () {
    Motor_Stop()
    MyRobotBit.Rotate(Turn.Left, Turn_Speed, Turn_Left_ms)
    Motor_Stop()
}
function Balance () {
    if (Error == 101) {
        iBIT.Spin(ibitSpin.Left, Slow_Speed)
        while (R1 == 1) {
            Convert_4_Analog()
        }
        basic.pause(10)
    } else if (Error == 102) {
        iBIT.Spin(ibitSpin.Right, Slow_Speed)
        while (L1 == 1) {
            Convert_4_Analog()
        }
        basic.pause(10)
    }
    Motor_Stop()
}
function Convert_4_Analog () {
    Read_4_Analog()
    if (L2 < Ref_L2) {
        L2 = 0
    } else {
        L2 = 1
    }
    if (L1 < Ref_L1) {
        L1 = 0
    } else {
        L1 = 1
    }
    if (R1 < Ref_R1) {
        R1 = 0
    } else {
        R1 = 1
    }
    if (R2 < Ref_R2) {
        R2 = 0
    } else {
        R2 = 1
    }
}
function Track_Time (Motor_Speed: number, Time: number) {
    Forward(Motor_Speed, 1)
    Timer0 = input.runningTime()
    while (input.runningTime() - Timer0 < Time) {
        Cal_Error()
        Track_PID()
    }
}
function Convert_2_Analog () {
    Read_2_Analog()
    if (BL < Ref_BL) {
        BL = 0
    } else {
        BL = 1
    }
    if (BR < Ref_BR) {
        BR = 0
    } else {
        BR = 1
    }
}
input.onButtonPressed(Button.B, function () {
    Forward(Speed, 1300)
    Motor_Stop()
})
function Box3 () {
    Backward(Speed, 400)
}
function Kick () {
    Motor_Stop()
    iBIT.Servo(ibitServo.SV1, 80)
    basic.pause(500)
    iBIT.Servo(ibitServo.SV1, 140)
}
function Track_PID () {
    Derivative = Error - Pre_Error
    Output = Kp * Error + (Ki * Integral + Kd * Derivative)
    Left_Output = Left_Speed + Output
    Right_Output = Right_Speed - Output
    if (Left_Output > Max_Speed) {
        Left_Output = Max_Speed
    }
    if (Right_Output > Max_Speed) {
        Right_Output = Max_Speed
    }
    if (Left_Output < -1 * Max_Speed) {
        Left_Output = -1 * Max_Speed
    }
    if (Right_Output < -1 * Max_Speed) {
        Right_Output = -1 * Max_Speed
    }
    if (Left_Output >= 0) {
        MyRobotBit.MotorON(motorSEL.M1, motorDIR.Forward, Left_Output)
    } else {
        MyRobotBit.MotorON(motorSEL.M1, motorDIR.Reverse, Left_Output)
    }
    if (Right_Output >= 0) {
        MyRobotBit.MotorON(motorSEL.M2, motorDIR.Forward, Right_Output)
    } else {
        MyRobotBit.MotorON(motorSEL.M2, motorDIR.Reverse, Right_Output)
    }
    Pre_Error = Error
    Integral += Error
}
function Cal_Error () {
    Convert_4_Analog()
    if (L1 == 0 && R1 == 0) {
        Error = 100
    } else if (L1 == 0 && R1 == 1) {
        Error = 101
    } else if (L1 == 1 && R1 == 0) {
        Error = 102
    } else if (R2 == 0) {
        Error = -1
    } else if (L2 == 0) {
        Error = 1
    } else {
        Error = 0
    }
}
function Backward_Balance () {
    Backward(Slow_Speed, 1)
    Status = 0
    while (Status == 0) {
        Convert_2_Analog()
        if (BL == 0 && BR == 0) {
            Status = 1
        } else if (BL == 0 && BR == 1) {
            MyRobotBit.motorOFF(motorSEL.M12, StopMode.Brake)
            MyRobotBit.MotorON(motorSEL.M2, motorDIR.Reverse, Slow_Speed)
            while (BR == 1) {
                Convert_2_Analog()
            }
            Status = 2
        } else if (BL == 1 && BR == 0) {
            MyRobotBit.motorOFF(motorSEL.M12, StopMode.Brake)
            MyRobotBit.MotorON(motorSEL.M1, motorDIR.Reverse, Slow_Speed)
            while (BL == 1) {
                Convert_2_Analog()
            }
            Status = 3
        }
    }
    Motor_Stop()
}
function Read_4_Analog () {
    L2 = MySensor.analogRead(MySensor.analogPort.P0)
    L1 = MySensor.analogRead(MySensor.analogPort.P1)
    R1 = MySensor.analogRead(MySensor.analogPort.P2)
    R2 = MySensor.analogRead(MySensor.analogPort.P3)
}
function Box2 () {
    Backward(Speed, 400)
}
function Backward (Motor_Speed: number, Time: number) {
    Tune_Motor(Motor_Speed)
    MyRobotBit.MotorAB(motorDIR.Reverse, Left_Speed - 0, Right_Speed - 0)
    basic.pause(Time)
}
function Motor_Stop () {
    MyRobotBit.motorOFF(motorSEL.M12, StopMode.Brake)
    basic.pause(100)
}
let Status = 0
let Right_Output = 0
let Left_Output = 0
let Output = 0
let Derivative = 0
let Timer0 = 0
let R2 = 0
let L2 = 0
let L1 = 0
let R1 = 0
let BR = 0
let BL = 0
let Max_Speed = 0
let Ki = 0
let Kd = 0
let Kp = 0
let Pre_Error = 0
let Integral = 0
let Error = 0
let Right_Speed = 0
let Left_Speed = 0
let Ref_BR = 0
let Ref_BL = 0
let Ref_R2 = 0
let Ref_R1 = 0
let Ref_L1 = 0
let Ref_L2 = 0
let Uturn_ms = 0
let Turn_Right_ms = 0
let Turn_Left_ms = 0
let Turn_Speed = 0
let Slow_Speed = 0
let Acc_Speed = 0
let Speed = 0
led.enable(false)
Speed = 70
Acc_Speed = 100
Slow_Speed = 50
Turn_Speed = 70
basic.showIcon(IconNames.Chessboard)
Turn_Left_ms = 0
Turn_Right_ms = 0
Uturn_ms = 0
Kick()
Ref_L2 = 2500
Ref_L1 = 2500
Ref_R1 = 2500
Ref_R2 = 2500
Ref_BL = 2500
Ref_BR = 2500
