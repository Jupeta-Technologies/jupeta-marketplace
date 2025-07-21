import React from 'react';
import '@/styles/memberCard.css';

const MemberCard = () => {
    return ( 
        <>
            <div className="memCard-con">
                <span style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                    <div className='memCard-Img'></div>
                    <span style={{fontWeight:'600'}}>JupetaUser1</span>
            
                    <span style={{position:"absolute", right:'16px'}}>since 24&apos;</span>
                </span>
                <span style={{fontSize:'small'}}>★★★★☆ (4.0/5)</span>
                <p style={{fontSize:'small'}}><strong>John D.</strong> - &ldquo;Great product, exactly as described!&rdquo;</p>
                <div style={{position:'absolute', bottom:'8px', alignItems:'center', alignSelf:'center'}}>
                    <span>Location | </span>
                    <span>Sold 2</span>
                </div>
            </div>
        </>
    );
}

export default MemberCard; 