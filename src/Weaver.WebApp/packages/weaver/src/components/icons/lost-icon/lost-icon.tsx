export const LostIcon: React.FC = () => (
  <svg
    width='160'
    height='160'
    viewBox='0 0 160 160'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    style={{ display: 'block', margin: '0 auto' }}
  >
    <style>{`
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-8px); }
      }
      @keyframes blink {
        0%, 90%, 100% { transform: scaleY(1); }
        95% { transform: scaleY(0.1); }
      }
      @keyframes wander {
        0%, 100% { transform: translateX(0px) rotate(-8deg); }
        50% { transform: translateX(6px) rotate(8deg); }
      }
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .floater { animation: float 3s ease-in-out infinite; transform-origin: 80px 100px; }
      .eye-l { animation: blink 4s ease-in-out infinite; transform-origin: 62px 62px; }
      .eye-r { animation: blink 4s ease-in-out infinite 0.1s; transform-origin: 98px 62px; }
      .wander-l { animation: wander 2.4s ease-in-out infinite; transform-origin: 30px 36px; }
      .wander-r { animation: wander 2s ease-in-out infinite 0.3s; transform-origin: 124px 38px; }
      .star-spin { animation: spin 6s linear infinite; transform-origin: 148px 110px; }
    `}</style>

    <g className='wander-l'>
      <text x='18' y='42' fontSize='24' fill='#faad14' fontWeight='bold' opacity='0.75'>
        ?
      </text>
    </g>
    <g className='wander-r'>
      <text x='118' y='44' fontSize='18' fill='#ff7875' fontWeight='bold' opacity='0.75'>
        ?
      </text>
    </g>
    <g className='star-spin'>
      <text x='142' y='116' fontSize='14' fill='#95de64' opacity='0.8'>
        ✦
      </text>
    </g>

    <ellipse cx='80' cy='150' rx='32' ry='5' fill='#00000012' />

    <g className='floater'>
      <circle cx='80' cy='74' r='36' fill='#fff3b0' stroke='#faad14' strokeWidth='2.5' />

      <rect x='46' y='63' width='68' height='14' rx='7' fill='#ff7875' opacity='0.9' />
      <rect x='52' y='65' width='30' height='4' rx='2' fill='#fff' opacity='0.25' />

      <g className='eye-l'>
        <ellipse cx='62' cy='59' rx='7' ry='8' fill='#fff' stroke='#faad14' strokeWidth='1.5' />
        <circle cx='63' cy='58' r='3.5' fill='#2d2d2d' />
        <circle cx='64.5' cy='56.5' r='1' fill='#fff' />
      </g>
      <g className='eye-r'>
        <ellipse cx='98' cy='59' rx='7' ry='8' fill='#fff' stroke='#faad14' strokeWidth='1.5' />
        <circle cx='99' cy='58' r='3.5' fill='#2d2d2d' />
        <circle cx='100.5' cy='56.5' r='1' fill='#fff' />
      </g>

      <path d='M107 54 Q109 49 111 54 Q111 58 109 59 Q107 58 107 54Z' fill='#91caff' opacity='0.9' />

      <path d='M65 90 Q72 96 80 93 Q88 90 95 93' stroke='#e8823a' strokeWidth='2.5' strokeLinecap='round' fill='none' />

      <g transform='rotate(14, 110, 106)'>
        <rect x='96' y='95' width='28' height='22' rx='3' fill='#fff9c4' stroke='#faad14' strokeWidth='1.5' />
        <line x1='100' y1='101' x2='120' y2='101' stroke='#faad14' strokeWidth='1' opacity='0.6' />
        <line x1='100' y1='106' x2='116' y2='106' stroke='#faad14' strokeWidth='1' opacity='0.6' />

        <circle cx='114' cy='113' r='2' fill='#ff7875' />
        <path d='M108 112 L113 108 L118 113' stroke='#ff7875' strokeWidth='1.2' fill='none' />
      </g>

      <ellipse cx='80' cy='122' rx='22' ry='16' fill='#fff3b0' stroke='#faad14' strokeWidth='2' />

      <line x1='68' y1='135' x2='62' y2='150' stroke='#faad14' strokeWidth='5' strokeLinecap='round' />
      <line x1='92' y1='135' x2='98' y2='150' stroke='#faad14' strokeWidth='5' strokeLinecap='round' />

      <ellipse cx='60' cy='151' rx='9' ry='4' fill='#ff7875' />
      <ellipse cx='100' cy='151' rx='9' ry='4' fill='#ff7875' />
    </g>
  </svg>
);

export default LostIcon;