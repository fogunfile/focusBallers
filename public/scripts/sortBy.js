// Sort by function sorting by array of argument "char" where the array to sort are sorted by increasing order of priority of elements of "char"
const sortBy = (arr, char) => {
    if(!Array.isArray(arr)){
        throw Error("First argument must be an array")
    } else {
        if(Array.isArray(char)){
            char.forEach((char1)=>{
                arr.sort((a, b)=> {
                    if(b[char1] > a[char1]){
                        return 1;
                    } else if(b[char1] < a[char1]) {
                        return -1;
                    }
                })
            })
        } else {
            arr.sort((a, b)=> {
                if(b[char] > a[char]){
                    return 1;
                } else if(b[char] < a[char]) {
                    return -1;
                }
            })
        }
    }
}