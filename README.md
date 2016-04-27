# CSiBE

test

[![Build Status](https://travis-ci.org/szeged/csibe.svg?branch=master)](https://travis-ci.org/szeged/csibe)

[CSiBE](http://www.csibe.org) is a code size benchmark for compilers.

The primary purpose of CSiBE is to monitor the size of the binary code generated by a compiler.

## Basic usage

CSiBE provides a simple Python script which can help to do your first measurement. The help screen of the script describes the commonly used features and options. See the available options executing:
```bash
$ ./csibe.py --help
```

The most common usage is to call ```csibe.py``` without any option.
```bash
$ ./csibe.py
```
This creates a ```build/native/all_results.csv``` results file which contains all the sizes of the generated binaries.

If you would like to embed CSiBE measurement routines to your own build or measurement framework you should first checkout out 'bin/create_sample_project' script. This will help you through to create your own measurement. To create a measurement project that uses a cross-compiler check out the 'bin/create_sample_cross_compile_project' script.

## Links

More info about the project can be found at http://www.csibe.org
Contact: http://www.sed.inf.u-szeged.hu/

## Licenses

The license of the CSiBE framework can be found in License.txt.
Open Source projects - under source directory - may have different license conditions. Each of them can be found under its container folder.
