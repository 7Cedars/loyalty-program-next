<!--
*** NB: This template was taken from: https://github.com/othneildrew/Best-README-Template/blob/master/README.md?plain=1 
*** For shields, see: https://shields.io/
-->
<a name="readme-top"></a>



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->


[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/7Cedars/loyalty-program-next"> 
    <img src="public/images/iconLoyaltyProgram.svg" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Loyal: A Web3 Customer Engagement App</h3>

  <p align="center">
    A composable, lightweight and fully open source dApp build for real-world customer engagments. 
    <br />
    <a href="https://github.com/7Cedars/loyalty-program-next"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <!--NB: TO DO --> 
    <a href="https://loyalty-program-psi.vercel.app">View Demo</a>
    ·
    <a href="https://github.com/7Cedars/loyalty-program-next/issues">Report Bug</a>
    ·
    <a href="https://github.com/7Cedars/loyalty-program-next/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project
A front-end dApp demonstration of a web3 protocol for customer engagement. Try it out here. 

This dApp interacts with two solidity protocols. 
- The first protocol sets out a standard for loyalty programs: an ERC-1155 based contract that mints points and non-fungible loyalty cards. The latter are registered as ERC-6551 Token Based Accounts and accumulate loyalty points. See this repository for an example implementation. 
- The second protocol sets out a standard for contracts that exchange points for gifts or vouchers. Gift contracts can be used in any loyalty program. See this repository for an example implementation.

Crucially, interactions between the two protocols are bounded: points and vouchers that are minted by a loyalty program can only be used among its own loyalty cards. Loyalty cards themselves are freely transferable.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With
<!-- See for a list of badges: https://github.com/Envoy-VC/awesome-badges -->
[![Next][Next.js]][Next-url]  [![React][React.js]][React-url] [![Redux][Redux]][Redux-url]  [![Tailwind][Tailwind-css]][Tailwind-url]


<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running do the following.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.
* npm and yarn
  ```sh
  npm install --global npm@latest yarn  
  ```

### Installation
<!-- NB: I have to check if I missed anyting £todo -->

1. Get a free alchemy API Key at [alchemy.com](https://docs.alchemy.com/docs/alchemy-quickstart-guide)
2. Setup a project at walletConnect cloud [WalletConnect](https://cloud.walletconnect.com/app) and create a wallet ID.  
3. Clone the repo
   ```sh
   git clone https://github.com/7Cedars/loyalty-program-next.git
   ```
4. Install packages
   ```sh
   yarn add
   ```
5. Create a .env file in the root directory and add the following lines: 
   ```js
   const NEXT_PUBLIC_ALCHEMY_API_KEY = 'your alchemy API Key';
   const NEXT_PUBLIC_WALLETCONNECT_ID = 'Your wallet Connect project id';
   ```
6. run 
   ```sh
   yarn dev
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- USAGE EXAMPLES -->
## Usage
This dApp is deployed at [loyalty-program-psi.vercel.app](https://loyalty-program-psi.vercel.app/). 

The repository consists of two dApps 
- A vendor dApp in which loyalty points and loyalty cards can be minted; loyalty gifts can be selected and gift vouchers minted; and a Qrcode scanner to read customer requests. It also provides a transaction overview. 
- A customer dApp that creates Qrcodes to request loyalty points, exchanging points for gifts or vouchers, and redeem vouchers for gifts. It also includes a transaction overview.

Some screenshots:
| Home screen vendor | Transactions vendor | Card overview customer |
| :--------: | :-------: | :-------: | 
| <img src="public/images/vendorHomeScreen.svg" alt="my-Card-view" width="200" />  | <img src="public/images/vendorTransactionScreen.svg" alt="my-Card-view" width="200" />  | <img src="public/images/customerCardScreen.svg" alt="my-Card-view" width="200" />  |

_For more examples, please refer to the [Documentation](https://example.com)_

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->
## Roadmap

- [ ] Feature 1
- [ ] Feature 2
- [ ] Feature 3
    - [ ] Nested Feature

See the [open issues](https://github.com/7Cedars/loyalty-program-next/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Your Name - [@twitter_handle](https://twitter.com/twitter_handle) - email@email_client.com

Project Link: [https://github.com/7Cedars/loyalty-program-next](https://github.com/7Cedars/loyalty-program-next)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* []()
* []()
* []()

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
<!-- [contributors-shield]: https://img.shields.io/github/contributors/7Cedars/loyalty-program-next.svg?style=for-the-badge
[contributors-url]: https://github.com/7Cedars/loyalty-program-next/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/7Cedars/loyalty-program-next.svg?style=for-the-badge
[forks-url]: https://github.com/7Cedars/loyalty-program-next/network/members
[stars-shield]: https://img.shields.io/github/stars/7Cedars/loyalty-program-next.svg?style=for-the-badge
[stars-url]: https://github.com/7Cedars/loyalty-program-next/stargazers -->
[issues-shield]: https://img.shields.io/github/issues/7Cedars/loyalty-program-next.svg?style=for-the-badge
[issues-url]: https://github.com/7Cedars/loyalty-program-next/issues/
[license-shield]: https://img.shields.io/github/license/7Cedars/loyalty-program-next.svg?style=for-the-badge
[license-url]: https://github.com/7Cedars/loyalty-program-next/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/linkedin_username
[product-screenshot]: images/screenshot.png
<!-- See list of icons here: https://hendrasob.github.io/badges/ -->
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Tailwind-css]: https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white
[Tailwind-url]: https://tailwindcss.com/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Redux]: https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white
[Redux-url]: https://redux.js.org/
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com 
