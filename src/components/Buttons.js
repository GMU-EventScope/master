import {useRef,useState,useEffect} from "react";

//reuseable button loader
const useButtonLoader = (defaultText = "Load",loadingText = "Loading...") => {
    const[isLoading,setLoading] = useState(false);
    const element = useRef(null);
    //Here is the code for switching a button to loading and normal state
    useEffect(() => {
        if(isLoading){
            element.current.disabled=true;
            element.current.innerHTML = 
                '<i class="fas fa-spinner fa-spin"></i>' + loadingText;
        }
        else{
            element.current.disabled=false;
            element.current.innerHTML = defaultText;
        }
    }, [isLoading]);
    return [element,setLoading];
};
export default useButtonLoader;