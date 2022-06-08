export const loadingPage = (url: string, metadata?: any) => `<!DOCTYPE html>
<html lang="en">
     <head>
        <!-- Primary Meta Tags -->
        <title>Mex - ${metadata?.title ?? 'Workduck'}</title>
        <meta name="title" content="${metadata?.title ?? 'Workduck'}">
        <meta name="description" content="${
          metadata?.description ?? 'Shortened link'
        }">

        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="website">
        <meta property="og:url" content="https://metatags.io/">
        <meta property="og:title" content="${metadata?.title ?? 'Workduck'}">
        <meta property="og:description" content="${
          metadata?.description ?? 'Shortened link'
        }">
        <meta property="og:image" content="${metadata?.image ?? ''}">

        <!-- Twitter -->
        <meta property="twitter:card" content="summary_large_image">
        <meta property="twitter:url" content="https://metatags.io/">
        <meta property="twitter:title" content="${
          metadata?.title ?? 'Workduck'
        }">
        <meta property="twitter:description" content="${
          metadata?.description ?? 'Shortened link'
        }">
        <meta property="twitter:image" content="${metadata?.image ?? ''}">
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link href="css/style.css" rel="stylesheet">
          <script>
            setTimeout(function(){
                window.open("${url}", "_self");
            }, 1000);
          </script>
        <style>
            * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
            }
            
            section {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    background: #112240;
                    animation: animateBg 10s linear infinite;
            }
            
            @keyframes animateBg {
                    0% {
                        filter: hue-rotate(0deg);
                    }
            
                    100% {
                        filter: hue-rotate(360deg);
                    }
            }
            
            section .preloader {
                    position: relative;
                    width: 7.5rem;
                    height: 7.5rem;
            
            }
            
            section .preloader span {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    transform: rotate(calc(20deg * var(--i)));
            }
            
            section .preloader span::before {
                    content: "";
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 15px;
                    height: 15px;
                    border-radius: 50%;
                    background: #00cffd;
                    box-shadow: 0px 0px 10px #00cffd,
                        0px 0px 20px #00cffd,
                        0px 0px 40px #112240,
                        0px 0px 80px #00cffd,
                        0px 0px 100px #112240;
                    animation: animate 2s linear infinite;
                    animation-delay: calc(0.1s * var(--i))
            }
            
            @keyframes animate {
                    0% {
                        transform: scale(1);
                    }
            
                    80%,
                    100% {
                        transform: scale(0);
                    }
            }
        </style>
    </head>
     <body>
     <section>
          <div class="preloader">
               <span style="--i:1;"></span>
               <span style="--i:2;"></span>
               <span style="--i:3;"></span>
               <span style="--i:4;"></span>
               <span style="--i:5;"></span>
               <span style="--i:6;"></span>
               <span style="--i:7;"></span>
               <span style="--i:8;"></span>
               <span style="--i:9;"></span>
               <span style="--i:10;"></span>
               <span style="--i:11;"></span>
               <span style="--i:12;"></span>
               <span style="--i:13;"></span>
               <span style="--i:14;"></span>
               <span style="--i:15;"></span>
               <span style="--i:16;"></span>
               <span style="--i:17;"></span>
               <span style="--i:18;"></span>
               <span style="--i:19;"></span>
               <span style="--i:20;"></span>
          </div>
     </section>
     </body>
</html>`;
