const checker = require('./dist/commonjs/index.js').TypeChecker({
    tsConfig: './tsconfig.json',
    basePath: './',
    tsLint: './tslint.json',
    name: 'checkerSync'
});

async function test1() {
    return new Promise(resolve => {
        console.log('test1');
        
        checker.printSettings();
        checker.inspectAndPrint();
        
        resolve();
        console.log('test1 --done...');
    });
}

async function test2() {
    return new Promise(resolve => {
        console.log('test2');
        
        checker.printSettings();
        let result = checker.inspectOnly();
        checker.printOnly(result);
        resolve();
        console.log('test2 --done...');
    });
}

async function test3() {
    return new Promise(resolve => {
        console.log('test3 --wait...');
        
        checker.worker_inspectAndPrint();
        
        setTimeout(() => {
            setTimeout(()=>{
                resolve();
                console.log('test3 --done...');
            },5000)
            
            console.log('test3 --shuting down worker');
        }, 10000);
    });
}



async function test4() {
    return new Promise(resolve => {
        console.log('test4 --wait...');
        
        checker.worker_Inspect();

        setTimeout(() => {
            resolve();
            console.log('test4 --done...');
        }, 10000);
    });
}

async function test5() {
    return new Promise(resolve => {
        console.log('test5 --wait...');
        
        checker.worker_print();

        setTimeout(() => {
            setTimeout(()=>{
                resolve();
                console.log('test5 --done...');
            },5000)
            
            
        }, 5000);
    });
}


async function test6() {
    return new Promise(resolve => {
        console.log('test6 --wait...');
        
        checker.worker_PrintSettings();

        setTimeout(() => {
            setTimeout(()=>{
                resolve();
                console.log('test6 --done...');
            },5000)
            
            console.log('test6 --shuting down worker');
        }, 5000);
    });
}


async function test7() {
    return new Promise(resolve => {
        console.log('test7 --wait...');
        
        checker.worker_watch('./src');

        setTimeout(() => {
            checker.worker_kill();
            resolve();
            console.log('test7 --done...');
            process.exit()
        }, 10000);
    });
}


async function main(){
    await test1();
    await test2();
    await test3();
    await test4();
    await test5();
    await test6();
    await test7(); 

}

main();

