import { downloadPdfFile } from '../src/utils';

describe('normaliseUrl', () => {
   
    it('should normaliseUrl srip out traying foreward slash', async () => {
        await downloadPdfFile('http://apps.who.int/iris/bitstream/10665/137592/1/roadmapsitrep_7Nov2014_eng.pdf');
    });

});

// http://apps.who.int/iris/bitstream/10665/137592/1/roadmapsitrep_7Nov2014_eng.pdf
//console.log(await downloadPdfFile('https://www.researchgate.net/profile/Nasrin-Sharifi-2/publication/224830809_Cardiovascular_Disease_Risk_Factors/links/09e4150d4bdc2597d0000000/Cardiovascular-Disease-Risk-Factors.pdf'));
