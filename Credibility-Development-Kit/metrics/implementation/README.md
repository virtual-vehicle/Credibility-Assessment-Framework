# IMPLEMENTATION

In the implementation phase, the different elements of the simulation setup (models, parameters, test cases, simulation environment) will be implemented and integrated according to the information from the design specification phase. The verification of the functionality of the elements individually and in their interaction in the simulation setup will be carried out within this phase.

Verification is one of the most discussed topics in the simulation community. However, a comparable methodology on how to approach verification in modeling and simulation can be observed: Conducting code verification first, embracing software quality assurance and numerical algorithm verification, followed by solution verification, focusing on the estimation of the numerical accuracy of discrete solutions compared to their mathematical model[^1][^2]

In this phase, the transition from collecting evidence by means of foundation and justification to collecting evidence by thorough verification and validation is made.

## Abstract Quality Metrics

The following serves as an implementation guideline for concrete quality metrics of the implementation phase.

**LEVEL 1: Informal Verification:** 

Basic code verification, beginning with Software Quality Assurance focusing on reliability and robustness from the perspective of software engineering, as for example described in the International Standard IEEE 730 (*Software Quality Assurance Processes*)[^3]. Must be followed by static code checks and basic dynamic code checks.

**LEVEL 2: Formal, qualitative verification:** 

Verification must be carried out according to formal methods, and results will be evaluated according to *qualitative* acceptance criteria.

**LEVEL 3: Formal, quantitative verification:** 

Verification must be carried out according to formal methods and results will be evaluated according to *quantitative* acceptance criteria, using benchmarks as quality criterions that have been agreed on between customer and supplier.

[^1]: Christopher John Roy (2005). Review of code and solution verification procedures for computational simulation. In: *Journal of Computational Physics, Volume 205, Issue 1. pp. 131-156.* DOI: 10.1016/j.jcp.2004.10.036
[^2]: William J. Rider (2019). The Foundations of Verification in Modeling and Simulation. In: *Simulation Foundations, Methods and Applications.* Springer. pp. 271-293. DOI: 10.1007/978-3-319-70766-2_11
[^3]: IEEE (2014). Software Quality Assurance Processes. Institute of Electrical and Electronics Engineers. *International Standard IEEE 730.* DOI: 10.1109/IEEESTD.1998.88284