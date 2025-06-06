import Link from 'next/link';

function TestPage() {
  return (
    <div style={{marginTop:"200px"}}>
      <Link href="/automobile">Go to Automobile</Link>
      <br />
      <Link href="/electronics">Go to Electronics</Link>
      {/* Add links for fashion and home-kitchen */}
    </div>
  );
}

export default TestPage;