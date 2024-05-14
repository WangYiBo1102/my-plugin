# Digital Lotus Cli

### Installation

~~~shell
npm install -g digital-lotus-cli
~~~

### Usage

#### init

Create a project based on [digital-lotus](https://git-nj.iwhalecloud.com/ucc/digital-lotus) template.

`digital init <project-name>[ -b <branch> -f]`

~~~shell
# local invoking
digital init my-app

# or remote invoking
npx digital-lotus-cli init my-app
~~~

#### update

Synchronize the `src/digital` directory with [digital-lotus](https://git-nj.iwhalecloud.com/ucc/digital-lotus) `src/digital`.

`digital update[ -b <branch>]`

~~~shell
# open your project workspace
cd my-app

digital update
~~~

> **Tip**
>
> You could look through more information by running `digital --help` or `digital <command> --help`.