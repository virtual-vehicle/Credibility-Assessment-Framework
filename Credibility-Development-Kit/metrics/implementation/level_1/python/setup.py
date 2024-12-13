from setuptools import setup

setup(
    name='cdk_implementation_level_1',
    version='0.0.1',    
    description='Level 1 simulation credibility metrics for implementation and integration, according to the Credibility Assessment Framework concept',
    url='https://github.com/virtual-vehicle/Credibility-Assessment-Framework/tree/dev/Credibility-Development-Kit/metrics/implementation/level_1/python',
    author='Maurizio Ahmann (localhorst87)',
    license='BSD 2-clause',
    packages=['fmu_checker'],
    install_requires=['fmpy==0.3.22'],
    classifiers=[
        'Development Status :: 2 - Pre-Alpha',
        'Intended Audience :: Science/Research',
        'License :: OSI Approved :: BSD License',  
        'Operating System :: POSIX :: Linux',
        'Programming Language :: Python :: 3.13'
    ])