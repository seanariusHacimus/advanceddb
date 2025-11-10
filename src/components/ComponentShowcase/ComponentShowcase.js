import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  Input,
  Label,
  FormGroup,
  Select,
  Checkbox,
  Radio,
  Switch,
  Badge,
  Avatar,
  Alert,
  AlertWithIcon,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Dialog,
  Tooltip,
  Separator,
  Skeleton,
  SkeletonCardPattern,
  Progress
} from '../UI/shadcn';
import { useToast } from '../UI/shadcn/toast';
import { useLocale } from '../../utils/locale';

const ShowcaseContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
`;

const Section = styled.section`
  margin-bottom: 48px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: hsl(var(--foreground));
  margin-bottom: 24px;
  transition: color 0.3s ease;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 16px;
`;

const FlexRow = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
`;

function ComponentShowcase() {
  const [t] = useLocale();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const [switchValue, setSwitchValue] = useState(false);
  const [radioValue, setRadioValue] = useState('option1');
  const [selectValue, setSelectValue] = useState('');
  const [tabValue, setTabValue] = useState('tab1');
  const [loading, setLoading] = useState(false);

  const showToastExample = () => {
    toast.success({
      title: 'Success!',
      description: 'This is a toast notification.',
    });
  };

  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <ShowcaseContainer>
      <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '16px' }}>
        shadcn/ui Component Showcase
      </h1>
      <p style={{ fontSize: '16px', color: 'hsl(var(--muted-foreground))', marginBottom: '48px' }}>
        Демонстрация всех компонентов shadcn/ui с поддержкой светлой и тёмной темы
      </p>

      {/* Buttons */}
      <Section>
        <SectionTitle>Buttons</SectionTitle>
        <Card>
          <CardContent style={{ paddingTop: '24px' }}>
            <FlexRow>
              <Button variant="default">Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
              <Button disabled>Disabled</Button>
            </FlexRow>
            <Separator style={{ margin: '20px 0' }} />
            <FlexRow>
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon">🔍</Button>
            </FlexRow>
          </CardContent>
        </Card>
      </Section>

      {/* Form Components */}
      <Section>
        <SectionTitle>Form Components</SectionTitle>
        <Grid>
          <Card>
            <CardHeader>
              <CardTitle>Input Fields</CardTitle>
            </CardHeader>
            <CardContent>
              <FormGroup>
                <Label data-required="true">Email</Label>
                <Input type="email" placeholder="Enter your email" />
              </FormGroup>
              <FormGroup>
                <Label>Password</Label>
                <Input type="password" placeholder="Enter password" />
              </FormGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Selection Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <FormGroup>
                <Checkbox 
                  checked={checked}
                  onChange={setChecked}
                  label="Accept terms and conditions"
                />
              </FormGroup>
              <FormGroup>
                <Switch 
                  checked={switchValue}
                  onCheckedChange={setSwitchValue}
                  label="Enable notifications"
                />
              </FormGroup>
              <FormGroup>
                <Label>Choose option</Label>
                <Radio.Group value={radioValue} onValueChange={setRadioValue}>
                  <Radio value="option1" label="Option 1" />
                  <Radio value="option2" label="Option 2" />
                  <Radio value="option3" label="Option 3" />
                </Radio.Group>
              </FormGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Select Dropdown</CardTitle>
            </CardHeader>
            <CardContent>
              <FormGroup>
                <Label>Select an option</Label>
                <Select 
                  value={selectValue} 
                  onValueChange={setSelectValue}
                  placeholder="Choose..."
                >
                  <Select.Label>Group 1</Select.Label>
                  <Select.Item value="1">Option 1</Select.Item>
                  <Select.Item value="2">Option 2</Select.Item>
                  <Select.Separator />
                  <Select.Label>Group 2</Select.Label>
                  <Select.Item value="3">Option 3</Select.Item>
                  <Select.Item value="4">Option 4</Select.Item>
                </Select>
              </FormGroup>
            </CardContent>
          </Card>
        </Grid>
      </Section>

      {/* Badges & Avatars */}
      <Section>
        <SectionTitle>Badges & Avatars</SectionTitle>
        <Card>
          <CardContent style={{ paddingTop: '24px' }}>
            <div style={{ marginBottom: '20px' }}>
              <Label>Badges</Label>
              <FlexRow>
                <Badge variant="default">Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="destructive">Error</Badge>
                <Badge variant="outline">Outline</Badge>
              </FlexRow>
            </div>
            <Separator />
            <div style={{ marginTop: '20px' }}>
              <Label>Avatars</Label>
              <FlexRow>
                <Avatar fallback="JD" size="sm" />
                <Avatar fallback="AB" size="default" status="online" />
                <Avatar fallback="CD" size="lg" status="busy" />
                <Avatar fallback="EF" size="xl" />
              </FlexRow>
            </div>
          </CardContent>
        </Card>
      </Section>

      {/* Alerts */}
      <Section>
        <SectionTitle>Alerts</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <AlertWithIcon 
            variant="default" 
            title="Default Alert"
            description="This is a default alert message."
          />
          <AlertWithIcon 
            variant="info" 
            title="Information"
            description="This is an informational message."
          />
          <AlertWithIcon 
            variant="success" 
            title="Success!"
            description="Your operation was completed successfully."
          />
          <AlertWithIcon 
            variant="warning" 
            title="Warning"
            description="Please review this before proceeding."
          />
          <AlertWithIcon 
            variant="destructive" 
            title="Error"
            description="Something went wrong. Please try again."
          />
        </div>
      </Section>

      {/* Tabs */}
      <Section>
        <SectionTitle>Tabs</SectionTitle>
        <Card>
          <CardContent style={{ paddingTop: '24px' }}>
            <Tabs value={tabValue} onValueChange={setTabValue}>
              <TabsList>
                <TabsTrigger value="tab1">Account</TabsTrigger>
                <TabsTrigger value="tab2">Password</TabsTrigger>
                <TabsTrigger value="tab3">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1">
                <p>Account settings content goes here.</p>
              </TabsContent>
              <TabsContent value="tab2">
                <p>Password change form goes here.</p>
              </TabsContent>
              <TabsContent value="tab3">
                <p>Settings options go here.</p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </Section>

      {/* Feedback Components */}
      <Section>
        <SectionTitle>Feedback Components</SectionTitle>
        <Grid>
          <Card>
            <CardHeader>
              <CardTitle>Toasts</CardTitle>
            </CardHeader>
            <CardContent>
              <FlexRow>
                <Button onClick={() => toast('Simple toast')}>
                  Simple
                </Button>
                <Button onClick={() => toast.success('Success!')}>
                  Success
                </Button>
                <Button onClick={() => toast.error('Error!')}>
                  Error
                </Button>
                <Button onClick={showToastExample}>
                  With Title
                </Button>
              </FlexRow>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dialog</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setDialogOpen(true)}>
                Open Dialog
              </Button>
              
              <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <Dialog.Close onClick={() => setDialogOpen(false)} />
                <Dialog.Header>
                  <Dialog.Title>Confirm Action</Dialog.Title>
                  <Dialog.Description>
                    Are you sure you want to proceed?
                  </Dialog.Description>
                </Dialog.Header>
                <Dialog.Body>
                  <p>This action cannot be undone.</p>
                </Dialog.Body>
                <Dialog.Footer>
                  <Button variant="ghost" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={() => {
                    toast.success('Action confirmed!');
                    setDialogOpen(false);
                  }}>
                    Confirm
                  </Button>
                </Dialog.Footer>
              </Dialog>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tooltip</CardTitle>
            </CardHeader>
            <CardContent>
              <FlexRow>
                <Tooltip content="Top tooltip" side="top">
                  <Button>Hover Top</Button>
                </Tooltip>
                <Tooltip content="Right tooltip" side="right">
                  <Button>Hover Right</Button>
                </Tooltip>
                <Tooltip content="Bottom tooltip" side="bottom">
                  <Button>Hover Bottom</Button>
                </Tooltip>
                <Tooltip content="Left tooltip" side="left">
                  <Button>Hover Left</Button>
                </Tooltip>
              </FlexRow>
            </CardContent>
          </Card>
        </Grid>
      </Section>

      {/* Loading States */}
      <Section>
        <SectionTitle>Loading States</SectionTitle>
        <Card>
          <CardHeader>
            <CardTitle>Skeleton Loaders</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={simulateLoading} style={{ marginBottom: '20px' }}>
              {loading ? 'Loading...' : 'Simulate Loading'}
            </Button>
            
            {loading ? (
              <>
                <SkeletonCardPattern />
                <Separator style={{ margin: '20px 0' }} />
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Skeleton width="100px" height="100px" circle />
                  <div style={{ flex: 1 }}>
                    <Skeleton width="60%" height="20px" style={{ marginBottom: '8px' }} />
                    <Skeleton width="40%" height="16px" style={{ marginBottom: '8px' }} />
                    <Skeleton width="80%" height="16px" />
                  </div>
                </div>
              </>
            ) : (
              <Alert variant="info">
                <Alert.Title>Ready</Alert.Title>
                <Alert.Description>Click the button to see skeleton loaders</Alert.Description>
              </Alert>
            )}
          </CardContent>
        </Card>
      </Section>

      {/* Progress */}
      <Section>
        <SectionTitle>Progress Bars</SectionTitle>
        <Card>
          <CardContent style={{ paddingTop: '24px' }}>
            <div style={{ marginBottom: '20px' }}>
              <Label>25% Progress</Label>
              <Progress value={25} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <Label>50% Progress</Label>
              <Progress value={50} />
            </div>
            <div>
              <Label>75% Progress</Label>
              <Progress value={75} />
            </div>
          </CardContent>
        </Card>
      </Section>
    </ShowcaseContainer>
  );
}

export default ComponentShowcase;

