import { useEffect } from 'react';

export const useConsoleEasterEgg = () => {
    useEffect(() => {
        const ascii = `
   ▄████████  ▄████████  ▄████████  ▄████████  ▄█     █▄   ▄█  ███▄▄▄▄      ▄█  
  ███    ███ ███    ███ ███    ███ ███    ███ ███     ███ ███  ███▀▀▀██▄   ███  
  ███    █▀  ███    ███ ███    ███ ███    ███ ███     ███ ███▌ ███   ███   ███▌ 
  ███        ███    ███ ███    ███ ███    ███ ███     ███ ███▌ ███   ███   ███▌ 
▀███████████ ███    ███ ███    ███ ███    ███ ███     ███ ███▌ ███   ███   ███▌ 
         ███ ███    ███ ███    ███ ███    ███ ███     ███ ███  ███   ███   ███  
   ▄█    ███ ███    ███ ███    ███ ███    ███ ███ ▄▄▄ ███ ███  ███   ███   ███  
 ▄████████▀  ████████▀  ████████▀  ████████▀  ▀██████████ █▀    ▀█   █▀    █▀   
                                                                              
        `;

        console.log(`%c${ascii}`, 'color: #10b981; font-weight: bold;');
        console.log(
            '%c Curioso sobre como o QuantoDá foi feito? Esse projeto usa React, Three.js e muito café.',
            'background: #0f172a; color: #10b981; padding: 10px; border-radius: 5px; font-family: monospace; font-size: 14px;'
        );
        console.log(
            '%c ⚠️ Atenção: não cole códigos aqui que você não entende. Mantenha sua conta segura.',
            'color: #ef4444; font-weight: bold; font-size: 12px; margin-top: 5px;'
        );
    }, []);
};
