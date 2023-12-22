import React, { useRef, useState, useEffect } from 'react';
//import { FaTimes } from 'react-icons/fa'

export default function EnterCode({ callback, reset, isLoading }) {
    const [code, setCode] = useState('');

    // Refs to control each digit input element
    const inputRefs = [
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
    ];

    // Reset all inputs and clear state
    const resetCode = () => {
        inputRefs.forEach(ref => {
            ref.current.value = '';
        });
        inputRefs[0].current.focus();
        setCode('');
    }

    // Call our callback when code = 6 chars
    useEffect(() => {
        if (code.length === 6) {
            if (typeof callback === 'function') callback(code);
            //resetCode();
        }
    }, [code]); //eslint-disable-line

    // Listen for external reset toggle
    useEffect(() => {
        resetCode();
    }, [reset]); //eslint-disable-line

     // Capture pasted characters
     const handlePaste = (e) => {
        const pastedCode = e.clipboardData.getData('text');
       console.log(pastedCode)
        if (pastedCode.length === 6) {
            
            inputRefs.forEach((inputRef, index) => {
                inputRef.current.value = pastedCode.charAt(index);
            });
            setCode(pastedCode);
        }
    };

    // Handle input
    function handleInput(e, index) {
        const input = e.target;
        console.log(input.value)
        const value=input.value
        const previousInput = inputRefs[index - 1];
        var nextInput = inputRefs[index + 1];
        if (value.trim().length > 1) {
            inputRefs.forEach((inputRef, index) => {
                inputRef.current.value = value.charAt(index);
            });
            nextInput = inputRefs[value.trim().length-1];
            nextInput.current.select();
            setCode(value);
          /*   e.clipboardData = {
              getData: () => input.value.trim(),
            };
           // resetCode();
           console.log(e)
           input.select();
            handlePaste(e); */
          } else {
           
    
            // Update code state with single digit
            const newCode = [...code];
            // Convert lowercase letters to uppercase
            if (/^[a-z]+$/.test(input.value)) {
                const uc = input.value.toUpperCase();
                newCode[index] = uc;
                inputRefs[index].current.value = uc;
            } else {
                newCode[index] = input.value;
            }
            setCode(newCode.join(''));
    
            input.select();
    
            if (input.value === '') {
                // If the value is deleted, select previous input, if exists
                if (previousInput) {
                    previousInput.current.focus();
                }
            } else if (nextInput) {
                // Select next input on entry, if exists
                nextInput.current.select();
            }
          }
       
    }

    // Select the contents on focus
    function handleFocus(e) {
        e.target.select();
    }

    // Handle backspace key
    function handleKeyDown(e, index) {
        const input = e.target;
        const previousInput = inputRefs[index - 1];
        const nextInput = inputRefs[index + 1];

        if ((e.keyCode === 8 || e.keyCode === 46) && input.value === '') {
            e.preventDefault();
            setCode((prevCode) => prevCode.slice(0, index) + prevCode.slice(index + 1));
            if (previousInput) {
                previousInput.current.focus();
            }
        }
    }

   

    // Clear button deletes all inputs and selects the first input for entry
    const ClearButton = () => {
        return (
            <button
                onClick={resetCode}
                className="text-2xl absolute right-[-30px] top-3"
            >
               {/*  <FaTimes /> */}
            </button>
        )
    }

    return (
        <div className="flex gap-2 relative">
            {[0, 1, 2, 3, 4, 5].map((index) => (
                <input
                    className="text-2xl bg-gray-800 w-10 flex p-2 text-center"
                    key={index}
                    type="text"
                    maxLength={1}
                    onChange={(e) => handleInput(e, index)}
                    ref={inputRefs[index]}
                    autoFocus={index === 0}
                    onFocus={handleFocus}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    disabled={isLoading}
                />
            ))}
           {/*  {
                code.length
                    ?
                    <ClearButton />
                    :
                    <></>
            } */}
        </div>
    );
}