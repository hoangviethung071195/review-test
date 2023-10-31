import { Add, CheckCircle, Delete } from '@mui/icons-material';
import { Card, CardContent, Checkbox, Fab, FormControlLabel, FormGroup, Grid, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { CustomTabPanel } from 'components/customTabPanel/CustomTabPanel';
import CustomDivider from 'components/divider/CustomDivider';
import { AdModel, CampaignModel, GeneralInfoModel, SubCampaignModel } from 'models/Campaign.model';
import { ChangeEvent, FormEvent, SyntheticEvent, useEffect, useState } from 'react';
import s from './campaign.module.scss';
import { Input } from 'components/input/Input';

interface CampaignInfo {
  campaign: CampaignModel;
  currentSubCampaign: SubCampaignModel;
  isCheckAll?: boolean;
}

export default function Campaign() {
  const initialSubCampaign = getDefaultSubCampaign();
  const [campaignInfo, setCampaign] = useState<CampaignInfo>({
    campaign: {
      information: {
        name: '',
        describe: ''
      },
      subCampaigns: [
        initialSubCampaign,
      ]
    },
    currentSubCampaign: initialSubCampaign,
    isCheckAll: false,
  });
  const { campaign, currentSubCampaign } = campaignInfo;
  const [tabValue, setTabValue] = useState(0);
  const [submitted, setIsSubmitted] = useState(false);

  function handleChange(event: SyntheticEvent, newValue: number) {
    setTabValue(newValue);
  };

  function changeCampainHandler(obj: GeneralInfoModel | SubCampaignModel | AdModel, fieldName: string) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const { value, checked, type } = e.target;
      if (type === 'number') {
        obj[fieldName] = +value;
      } else if (type === 'checkbox') {
        obj[fieldName] = checked;
      } else {
        obj[fieldName] = value;
      }
      const newObj = {
        ...campaignInfo
      };
      setCampaign(newObj);
    };
  }

  function getDefaultSubCampaign(campaign?: CampaignModel): SubCampaignModel {
    return {
      subCampaignId: Math.random().toString(),
      name: 'Chiến dịch con ' + ((campaign?.subCampaigns?.length || 0) + 1),
      status: true,
      ads: [
        getDefaultAd(),
      ]
    };
  }

  function getDefaultAd(subCampaign?: SubCampaignModel): AdModel {
    return {
      adId: Math.random().toString(),
      name: 'Quảng cáo ' + ((subCampaign?.ads?.length || 0) + 1),
      quantity: 0,
      checked: false
    };
  }

  function changetab(tab: SubCampaignModel) {
    const newInfo: CampaignInfo = {
      ...campaignInfo,
      currentSubCampaign: tab
    };
    setCampaign(newInfo);
  }

  function addNewSubCampaign() {
    const newSubCampaign = getDefaultSubCampaign(campaign);
    campaign.subCampaigns.push(newSubCampaign);
    campaignInfo.currentSubCampaign = newSubCampaign;
    setCampaign({
      ...campaignInfo,
    });
  }

  function addNewAd() {
    const newAd = getDefaultAd(currentSubCampaign);
    currentSubCampaign.ads.push(newAd);
    updateCampaign();
  }

  function removeAd(row: AdModel) {
    currentSubCampaign.ads = currentSubCampaign.ads.filter(ad => ad.adId !== row.adId);
    updateCampaign();
  }

  function removeAds() {
    currentSubCampaign.ads = currentSubCampaign.ads.filter(ad => !ad.checked);
    updateCampaign();
  }

  function changeCheckAllHandler(event: ChangeEvent<HTMLInputElement>, checked: boolean) {
    campaignInfo.isCheckAll = checked;
    currentSubCampaign.ads.forEach(ad => {
      ad.checked = checked;
    });
    updateCampaign();
  }

  function updateCampaign() {
    setCampaign({ ...campaignInfo });
  }

  function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isValidated()) {
      setIsSubmitted(true);
      return;
    }
    setIsSubmitted(false);
    const { name, describe } = campaign.information;
    const data: CampaignModel = {
      information: {
        name,
        describe
      },
      subCampaigns: campaign.subCampaigns.map(sub => {
        const { name, status } = sub;
        const ads: AdModel[] = sub.ads.map(a => ({
          name: a.name,
          quantity: a.quantity
        }));
        return {
          name,
          status,
          ads
        };

      })
    };
    console.log('data ', data);
    alert(`
Thêm thành công chiến dịch
${JSON.stringify(data)}
`
    );
  }

  function isValidated() {
    campaign.subCampaigns.forEach(sub => {
      sub.isError = false;
    });

    let isValid = true;
    if (!campaign.information.name) {
      isValid = false;
    }

    campaign.subCampaigns.forEach(sub => {
      if (!sub.name || !sub.ads.length) {
        sub.isError = true;
        isValid = false;
      }
      sub.ads.forEach(ad => {
        if (!ad.name || ad.quantity < 1) {
          sub.isError = true;
          isValid = false;
          return;
        }
      });
    });
    if (!isValid) {
      updateCampaign();
      warn();
      return false;
    }
    campaign.subCampaigns.forEach(sub => {
      sub.isError = false;
    });
    updateCampaign();
    return true;
  }

  function warn() {
    alert('Vui lòng điền đúng và đầy đủ thông tin');
  }

  return (
    <Container component="form" maxWidth="xl" className={s['campaign-container']} onSubmit={save} noValidate >
      <Button variant="contained" type='submit'>
        Submit
      </Button>
      <CustomDivider />
      <Paper className={s['paper']}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleChange}>
            <Tab label="Thông tin" />
            <Tab label="Chiến dịch con" />
          </Tabs>
        </Box>
        <CustomTabPanel value={tabValue} index={0}>
          <Input
            required
            submitted={submitted}
            label="Tên chiến dịch"
            onChange={changeCampainHandler(campaign.information, 'name')}
            value={campaign.information.name}
          />
          <Input
            label="Mô tả"
            onChange={changeCampainHandler(campaign.information, 'describe')}
            value={campaign.information.describe}
          />
        </CustomTabPanel>
        <CustomTabPanel value={tabValue} index={1}>
          <Box className={s['sub-campaign-info']}>
            <Fab size='medium' className={s['add-icon-btn']} onClick={addNewSubCampaign}>
              <Add color='error' />
            </Fab>
            {
              campaign.subCampaigns.map((sub) => (
                <Card key={sub.subCampaignId} className={'tab-panel-card ' + (sub.subCampaignId === currentSubCampaign.subCampaignId ? 'active-card' : '')} onClick={() => changetab(sub)}>
                  <CardContent>
                    <Typography fontSize={'1.2rem'} color={sub.isError ? 'error' : ''} gutterBottom>
                      {sub.name}
                      <CheckCircle color='success' sx={{ fontSize: '15px', ml: 1 }}></CheckCircle>
                    </Typography>
                    <Typography variant='h5' textAlign={'center'}>{sub.ads.reduce((a, b) => a + +b.quantity, 0)}</Typography>
                  </CardContent>
                </Card>
              ))
            }
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={8}>
              <Input
                required
                submitted={submitted}
                label="Tên chiến dịch con"
                onChange={changeCampainHandler(currentSubCampaign, 'name')}
                value={currentSubCampaign.name}
              />
            </Grid>
            <Grid item xs={4} justifySelf='center'>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={currentSubCampaign.status} onChange={changeCampainHandler(currentSubCampaign, 'status')} />}
                  label="Đang hoạt động"
                  sx={{ justifyContent: 'center', mb: 0 }}
                />
              </FormGroup>
            </Grid>
          </Grid>

          <Typography className={s['title-of-list']}>
            DANH SÁCH QUẢNG CÁO
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ py: 0 }}>
                    <FormControlLabel
                      sx={{ mb: 0 }}
                      label=""
                      control={
                        <Checkbox
                          disabled={!currentSubCampaign.ads.length}
                          checked={!!(currentSubCampaign.ads.length && currentSubCampaign.ads.every(ad => ad.checked))}
                          onChange={changeCheckAllHandler}
                          indeterminate={currentSubCampaign.ads.some(ad => ad.checked !== currentSubCampaign.ads[0].checked)}
                        />
                      }
                    />
                  </TableCell>
                  {
                    currentSubCampaign.ads.some(ad => ad.checked) ?
                      <>
                        <TableCell>
                          <IconButton onClick={() => removeAds()}>
                            <Delete fontSize={'small'} />
                          </IconButton>
                        </TableCell>
                        <TableCell></TableCell>
                      </>
                      :
                      <>
                        <TableCell>Tên quảng cáo*</TableCell>
                        <TableCell>Số lượng*</TableCell>
                      </>
                  }

                  <TableCell align="right">
                    <Button variant="outlined" startIcon={<Add />} onClick={addNewAd}>
                      Thêm
                    </Button>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentSubCampaign.ads.map((row) => (
                  <TableRow
                    key={row.adId}
                    sx={{ border: 0 }}
                  >
                    <TableCell sx={{ py: 0, width: '40px' }}>
                      <FormControlLabel
                        label=''
                        control={<Checkbox checked={row.checked} onChange={changeCampainHandler(row, 'checked')} />}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        required
                        submitted={submitted}
                        onChange={changeCampainHandler(row, 'name')}
                        value={row.name}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        required
                        error={submitted && row.quantity <= 0}
                        type='number'
                        onChange={changeCampainHandler(row, 'quantity')}
                        value={row.quantity}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => removeAd(row)} disabled={currentSubCampaign.ads.some(ad => ad.checked)}>
                        <Delete fontSize={'small'} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CustomTabPanel>
      </Paper>
    </Container>
  );
}