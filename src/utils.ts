export function makeImagePath(id:string, format?:string) {
    return `https://image.tmdb.org/t/p/${format ? format: "original"}/${id}`//url을 리턴해줌
}//이미지를 불러오는 함수
//"w500"을 props로 보냄