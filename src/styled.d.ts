import "styled-components";

//DefaultTheme에 대한 자료형 설정
//타입스크립트에게 테마의 자료형 알려주는것
declare module "styled-components" {
    export interface DefaultTheme {
        red: string;
        black: {
            veryDark: string;
            darker: string;
            lighter: string;
        };
        white: {
            darker: string;
            lighter: string;
        };
    }
}