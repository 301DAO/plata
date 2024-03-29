import * as React from 'react';

type ConnectIcon = {
  name: 'MetaMask' | 'Injected' | 'WalletConnect' | 'Coinbase Wallet';
  icon: React.ReactNode;
};

export const WalletIcon = ({ name }: { name: string }) => (
  <>{connectIcons.find(icon => icon.name === name)?.icon}</>
);

export const connectIcons: ConnectIcon[] = [
  {
    name: 'Injected',
    icon: <Metamask />,
  },
  {
    name: 'MetaMask',
    icon: <Metamask />,
  },
  {
    name: 'WalletConnect',
    icon: <WalletConnect />,
  },
  {
    name: 'Coinbase Wallet',
    icon: <Coinbase />,
  },
];

function WalletConnect() {
  return (
    <svg width="300px" height="185px" viewBox="0 0 300 185" version="1.1" className="h-12 w-12">
      <defs></defs>
      <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="walletconnect-logo-alt" fill="#3B99FC" fillRule="nonzero">
          <path
            d="M61.4385429,36.2562612 C110.349767,-11.6319051 189.65053,-11.6319051 238.561752,36.2562612 L244.448297,42.0196786 C246.893858,44.4140867 246.893858,48.2961898 244.448297,50.690599 L224.311602,70.406102 C223.088821,71.6033071 221.106302,71.6033071 219.883521,70.406102 L211.782937,62.4749541 C177.661245,29.0669724 122.339051,29.0669724 88.2173582,62.4749541 L79.542302,70.9685592 C78.3195204,72.1657633 76.337001,72.1657633 75.1142214,70.9685592 L54.9775265,51.2530561 C52.5319653,48.8586469 52.5319653,44.9765439 54.9775265,42.5821357 L61.4385429,36.2562612 Z M280.206339,77.0300061 L298.128036,94.5769031 C300.573585,96.9713 300.573599,100.85338 298.128067,103.247793 L217.317896,182.368927 C214.872352,184.763353 210.907314,184.76338 208.461736,182.368989 C208.461726,182.368979 208.461714,182.368967 208.461704,182.368957 L151.107561,126.214385 C150.496171,125.615783 149.504911,125.615783 148.893521,126.214385 C148.893517,126.214389 148.893514,126.214393 148.89351,126.214396 L91.5405888,182.368927 C89.095052,184.763359 85.1300133,184.763399 82.6844276,182.369014 C82.6844133,182.369 82.684398,182.368986 82.6843827,182.36897 L1.87196327,103.246785 C-0.573596939,100.852377 -0.573596939,96.9702735 1.87196327,94.5758653 L19.7936929,77.028998 C22.2392531,74.6345898 26.2042918,74.6345898 28.6498531,77.028998 L86.0048306,133.184355 C86.6162214,133.782957 87.6074796,133.782957 88.2188704,133.184355 C88.2188796,133.184346 88.2188878,133.184338 88.2188969,133.184331 L145.571,77.028998 C148.016505,74.6345347 151.981544,74.6344449 154.427161,77.028798 C154.427195,77.0288316 154.427229,77.0288653 154.427262,77.028899 L211.782164,133.184331 C212.393554,133.782932 213.384814,133.782932 213.996204,133.184331 L271.350179,77.0300061 C273.79574,74.6355969 277.760778,74.6355969 280.206339,77.0300061 Z"
            id="WalletConnect"
          ></path>
        </g>
      </g>
    </svg>
  );
}

function Metamask() {
  return (
    <svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      viewBox="0 0 318.6 318.6"
      className="h-12 w-12"
    >
      <style jsx>
        {`
          .st0 {
            fill: #e2761b;
            stroke: #e2761b;
            stroke-linecap: round;
            stroke-linejoin: round;
          }
          .st1 {
            fill: #e4761b;
            stroke: #e4761b;
            stroke-linecap: round;
            stroke-linejoin: round;
          }
          .st2 {
            fill: #d7c1b3;
            stroke: #d7c1b3;
            stroke-linecap: round;
            stroke-linejoin: round;
          }
          .st3 {
            fill: #233447;
            stroke: #233447;
            stroke-linecap: round;
            stroke-linejoin: round;
          }
          .st4 {
            fill: #cd6116;
            stroke: #cd6116;
            stroke-linecap: round;
            stroke-linejoin: round;
          }
          .st5 {
            fill: #e4751f;
            stroke: #e4751f;
            stroke-linecap: round;
            stroke-linejoin: round;
          }
          .st6 {
            fill: #f6851b;
            stroke: #f6851b;
            stroke-linecap: round;
            stroke-linejoin: round;
          }
          .st7 {
            fill: #c0ad9e;
            stroke: #c0ad9e;
            stroke-linecap: round;
            stroke-linejoin: round;
          }
          .st8 {
            fill: #161616;
            stroke: #161616;
            stroke-linecap: round;
            stroke-linejoin: round;
          }
          .st9 {
            fill: #763d16;
            stroke: #763d16;
            stroke-linecap: round;
            stroke-linejoin: round;
          }
        `}
      </style>
      <polygon className="st0" points="274.1,35.5 174.6,109.4 193,65.8 " />
      <g>
        <polygon className="st1" points="44.4,35.5 143.1,110.1 125.6,65.8 	" />
        <polygon className="st1" points="238.3,206.8 211.8,247.4 268.5,263 284.8,207.7 	" />
        <polygon className="st1" points="33.9,207.7 50.1,263 106.8,247.4 80.3,206.8 	" />
        <polygon className="st1" points="103.6,138.2 87.8,162.1 144.1,164.6 142.1,104.1 	" />
        <polygon className="st1" points="214.9,138.2 175.9,103.4 174.6,164.6 230.8,162.1 	" />
        <polygon className="st1" points="106.8,247.4 140.6,230.9 111.4,208.1 	" />
        <polygon className="st1" points="177.9,230.9 211.8,247.4 207.1,208.1 	" />
      </g>
      <g>
        <polygon className="st2" points="211.8,247.4 177.9,230.9 180.6,253 180.3,262.3 	" />
        <polygon className="st2" points="106.8,247.4 138.3,262.3 138.1,253 140.6,230.9 	" />
      </g>
      <polygon className="st3" points="138.8,193.5 110.6,185.2 130.5,176.1 " />
      <polygon className="st3" points="179.7,193.5 188,176.1 208,185.2 " />
      <g>
        <polygon className="st4" points="106.8,247.4 111.6,206.8 80.3,207.7 	" />
        <polygon className="st4" points="207,206.8 211.8,247.4 238.3,207.7 	" />
        <polygon
          className="st4"
          points="230.8,162.1 174.6,164.6 179.8,193.5 188.1,176.1 208.1,185.2 	"
        />
        <polygon
          className="st4"
          points="110.6,185.2 130.6,176.1 138.8,193.5 144.1,164.6 87.8,162.1 	"
        />
      </g>
      <g>
        <polygon className="st5" points="87.8,162.1 111.4,208.1 110.6,185.2 	" />
        <polygon className="st5" points="208.1,185.2 207.1,208.1 230.8,162.1 	" />
        <polygon className="st5" points="144.1,164.6 138.8,193.5 145.4,227.6 146.9,182.7 	" />
        <polygon className="st5" points="174.6,164.6 171.9,182.6 173.1,227.6 179.8,193.5 	" />
      </g>
      <polygon
        className="st6"
        points="179.8,193.5 173.1,227.6 177.9,230.9 207.1,208.1 208.1,185.2 "
      />
      <polygon
        className="st6"
        points="110.6,185.2 111.4,208.1 140.6,230.9 145.4,227.6 138.8,193.5 "
      />
      <polygon
        className="st7"
        points="180.3,262.3 180.6,253 178.1,250.8 140.4,250.8 138.1,253 138.3,262.3 106.8,247.4 117.8,256.4
	140.1,271.9 178.4,271.9 200.8,256.4 211.8,247.4 "
      />
      <polygon
        className="st8"
        points="177.9,230.9 173.1,227.6 145.4,227.6 140.6,230.9 138.1,253 140.4,250.8 178.1,250.8 180.6,253 "
      />
      <g>
        <polygon
          className="st9"
          points="278.3,114.2 286.8,73.4 274.1,35.5 177.9,106.9 214.9,138.2 267.2,153.5 278.8,140 273.8,136.4
		281.8,129.1 275.6,124.3 283.6,118.2 	"
        />
        <polygon
          className="st9"
          points="31.8,73.4 40.3,114.2 34.9,118.2 42.9,124.3 36.8,129.1 44.8,136.4 39.8,140 51.3,153.5 103.6,138.2
		140.6,106.9 44.4,35.5 	"
        />
      </g>
      <polygon
        className="st6"
        points="267.2,153.5 214.9,138.2 230.8,162.1 207.1,208.1 238.3,207.7 284.8,207.7 "
      />
      <polygon
        className="st6"
        points="103.6,138.2 51.3,153.5 33.9,207.7 80.3,207.7 111.4,208.1 87.8,162.1 "
      />
      <polygon
        className="st6"
        points="174.6,164.6 177.9,106.9 193.1,65.8 125.6,65.8 140.6,106.9 144.1,164.6 145.3,182.8 145.4,227.6
	173.1,227.6 173.3,182.8 "
      />
    </svg>
  );
}

function Coinbase() {
  return <img src="/assets/images/coinbase.png" className="h-12 w-12" alt="Coinbase" />;
}
