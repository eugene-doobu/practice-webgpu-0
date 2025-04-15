fn main() {
    // primitive: 가장 간단한, stack 에 올라갈 수 있는..
    // The signed integers are: i8, i16, i32, i64, i128, and isize.
    // The unsigned integers are: u8, u16, u32, u64, u128, and usize.
    // isize => 32비트 => i32,  64비트 => i64
    println!("Hello, world!");

    let my_number = 100; // 기본적으로 i32
    let my_other_number : u8 = 50;

    // u8 + i32는 연산이 안됨(서로 다른 타입).
    // 위 케이스에서 my_number 는 원래 i32이지만,
    // 아래 식을 계산하면서 u8로 타입이 변환 됨.
    let third_number = my_number + my_other_number;
    // overflow 발생시 에러 발생

    println!("{}", third_number);
}
