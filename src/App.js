import React, { useCallback, useEffect, useState } from "react";
import {
  Layout,
  EmptyState,
  Spinner,
  Frame,
  TopBar,
  Navigation,
  Tabs,
  Card,
  ActionList,
  ButtonGroup,
  Button,
  Form,
  TextField,
  TextContainer,
  Select,
  Toast,
  Modal,
  Icon,
  Text,
} from "@shopify/polaris";

import {
  MobileMajor,
  MobileBackArrowMajor,
  HeaderMajor,
  TextBlockMajor,
  FooterMajor,
  ColorsMajor,
  TypeMajor,
  DesktopMajor,
  ViewportWideMajor,
} from "@shopify/polaris-icons";

import {
  useField,
  useForm,
  notEmpty,
  submitSuccess,
} from "@shopify/react-form";
import styled from "styled-components";
import defaults from "./defaults";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);

  const [settings, setSettings] = useState({});
  const [selectedSetting, setSelectedSetting] = useState("");

  const [desktopNavigationActive, setDesktopNavigationActive] = useState(true);
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);
  const toggleMobileNavigationActive = useCallback(
    () =>
      setMobileNavigationActive(
        (mobileNavigationActive) => !mobileNavigationActive
      ),
    []
  );

  const [previewWidth, setPreviewWidth] = useState("100%");

  const [toast, setToast] = useState({});
  const toastMarkup = toast.active ? (
    <Toast
      content={toast.content}
      onDismiss={() => setToast({})}
      duration={3000}
    />
  ) : null;

  const [discardConfirmationModal, setDiscardConfirmationModal] =
    useState(false);
  const discardConfirmationModalMarkup = discardConfirmationModal ? (
    <Modal
      open={discardConfirmationModal}
      onClose={() => {
        setDiscardConfirmationModal(false);
      }}
      title="Discard all unsaved changes"
      primaryAction={{
        content: "Discard changes",
        onAction: () => {
          reset();
          setDiscardConfirmationModal(false);
        },
        destructive: true,
      }}
      secondaryActions={[
        {
          content: "Continue editing",
          onAction: () => {
            setDiscardConfirmationModal(false);
          },
        },
      ]}
    >
      <Modal.Section>
        <TextContainer>
          <p>
            If you discard changes, you’ll delete any edits you made since you
            last saved.
          </p>
        </TextContainer>
      </Modal.Section>
    </Modal>
  ) : null;

  const [resetToDefaultModal, setResetToDefaultModal] = useState(false);
  const resetToDefaultModalMarkup = resetToDefaultModal ? (
    <Modal
      open={resetToDefaultModal}
      onClose={() => {
        setResetToDefaultModal(false);
      }}
      title="Reset all settings to default"
      primaryAction={{
        content: "Reset settings",
        onAction: async () => {
          setResetting(true);
          setTimeout(() => {
            setSettings(defaults);
            setResetting(false);
            setResetToDefaultModal(false);
            setToast({ active: true, content: "Settings reset", error: false });
          }, 1000);
        },
        destructive: true,
        loading: resetting,
      }}
      secondaryActions={[
        {
          content: "Continue editing",
          onAction: () => {
            setResetToDefaultModal(false);
          },
          disabled: resetting,
        },
      ]}
    >
      <Modal.Section>
        <TextContainer>
          <p>
            If you reset settings, you’ll delete any edits you made since you
            last saved.
          </p>
        </TextContainer>
      </Modal.Section>
    </Modal>
  ) : null;

  const [selectedNavigationTab, setSelectedNavigationTab] = useState(0);
  const handleNavigationTabChange = useCallback(
    (selectedTabIndex) => setSelectedNavigationTab(selectedTabIndex),
    []
  );

  const [selectedViewTab, setSelectedViewTab] = useState(1);
  const handleViewTabChange = useCallback(
    (selectedTabIndex) => setSelectedViewTab(selectedTabIndex),
    []
  );

  const { fields, submit, dirty, reset } = useForm({
    fields: {
      headerText: useField({
        value: settings.headerText,
        validates: notEmpty("Text is required"),
      }),
      bodyText: useField({
        value: settings.bodyText,
        validates: notEmpty("Text is required"),
      }),
      footerText: useField({
        value: settings.footerText,
        validates: notEmpty("Text is required"),
      }),
      backgroundColor: useField({
        value: settings.backgroundColor,
        validates: notEmpty("Color is required"),
      }),
      headerTextColor: useField({
        value: settings.headerTextColor,
        validates: notEmpty("Color is required"),
      }),
      bodyTextColor: useField({
        value: settings.bodyTextColor,
        validates: notEmpty("Color is required"),
      }),
      footerTextColor: useField({
        value: settings.footerTextColor,
        validates: notEmpty("Color is required"),
      }),
      headerTextFont: useField(settings.headerTextFont),
      bodyTextFont: useField(settings.bodyTextFont),
      footerTextFont: useField(settings.footerTextFont),
    },
    onSubmit: async (form) => {
      //save settings to db
      setSaving(true);
      setTimeout(() => {
        setSettings(form);
        setSaving(false);
        setToast({ active: true, content: "Settings saved", error: false });
      }, 1000);
      return submitSuccess();
    },
  });

  useEffect(() => {
    selectedViewTab === 0 ? setPreviewWidth("375px") : setPreviewWidth("100%");
    selectedViewTab === 2
      ? setDesktopNavigationActive(false)
      : setDesktopNavigationActive(true);
    var views = document.querySelector(".Polaris-TopBar__SearchField");
    if (views !== null) {
      if (selectedViewTab === 2) {
        views.style.marginLeft = "-84px";
      } else {
        views.style.marginLeft = "148px";
      }
    }
  }, [selectedViewTab]);

  useEffect(() => {
    //load settings from db
    setTimeout(() => {
      setSettings(defaults);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <Layout>
        <EmptyState>
          <div
            style={{
              position: "fixed",
              top: "45%",
              left: "50%",
              transform: "translate(-50%, -45%)",
            }}
          >
            <Spinner
              accessibilityLabel="Loading..."
              size="large"
              color="teal"
            />
          </div>
        </EmptyState>
      </Layout>
    );
  }

  return (
    <Form onSubmit={submit}>
      <Frame
        topBar={
          <TopBar
            showNavigationToggle
            onNavigationToggle={toggleMobileNavigationActive}
            searchField={
              <Tabs
                tabs={[
                  {
                    id: "phone",
                    content: (
                      <Icon
                        source={MobileMajor}
                        color={selectedViewTab === 0 ? "ink" : "inkLightest"}
                      />
                    ),
                    accessibilityLabel: "Phone",
                    panelID: "phone-view",
                  },
                  {
                    id: "desktop",
                    content: (
                      <Icon
                        source={DesktopMajor}
                        color={selectedViewTab === 1 ? "ink" : "inkLightest"}
                      />
                    ),
                    accessibilityLabel: "Desktop",
                    panelID: "desktop-view",
                  },
                  {
                    id: "fullscreen",
                    content: (
                      <Icon
                        source={ViewportWideMajor}
                        color={selectedViewTab === 2 ? "ink" : "inkLightest"}
                      />
                    ),
                    accessibilityLabel: "Fullscreen",
                    panelID: "fullscreen-view",
                  },
                ]}
                selected={selectedViewTab}
                onSelect={handleViewTabChange}
              ></Tabs>
            }
            userMenu={
              <Button
                id="save"
                primary
                disabled={!dirty}
                loading={saving}
                submit={true}
              >
                Save
              </Button>
            }
            secondaryMenu={
              <Button
                id="discard"
                disabled={!dirty}
                onClick={() => {
                  setDiscardConfirmationModal(true);
                }}
              >
                Discard
              </Button>
            }
          />
        }
        showMobileNavigation={mobileNavigationActive}
        onNavigationDismiss={toggleMobileNavigationActive}
        navigation={
          desktopNavigationActive ? (
            <Navigation location="/">
              {selectedSetting === "" && (
                <Tabs
                  fitted
                  tabs={[
                    {
                      id: "sections",
                      content: "Sections",
                      accessibilityLabel: "Sections",
                      panelID: "sections-content",
                    },
                    {
                      id: "settings",
                      content: "Settings",
                      panelID: "settings-content",
                    },
                  ]}
                  selected={selectedNavigationTab}
                  onSelect={handleNavigationTabChange}
                ></Tabs>
              )}
              {selectedSetting === "" && selectedNavigationTab === 0 && (
                <>
                  <ActionList />
                  <Card>
                    <ActionList
                      items={[
                        {
                          content: "Header",
                          prefix: (
                            <Icon source={HeaderMajor} color="inkLightest" />
                          ),
                          suffix: "",
                          onAction: () => {
                            setSelectedSetting("Header");
                          },
                        },
                      ]}
                    />
                  </Card>
                  <Card>
                    <ActionList
                      items={[
                        {
                          content: "Body",
                          prefix: (
                            <Icon source={TextBlockMajor} color="inkLightest" />
                          ),
                          suffix: "",
                          onAction: () => {
                            setSelectedSetting("Body");
                          },
                        },
                      ]}
                    />
                  </Card>
                  <Card>
                    <ActionList
                      items={[
                        {
                          content: "Footer",
                          prefix: (
                            <Icon source={FooterMajor} color="inkLightest" />
                          ),
                          suffix: "",
                          onAction: () => {
                            setSelectedSetting("Footer");
                          },
                        },
                      ]}
                    />
                  </Card>
                </>
              )}
              {selectedSetting === "" && selectedNavigationTab === 1 && (
                <>
                  <ActionList />
                  <Card>
                    <ActionList
                      items={[
                        {
                          content: "Colors",
                          prefix: (
                            <Icon source={ColorsMajor} color="inkLightest" />
                          ),
                          suffix: "",
                          onAction: () => {
                            setSelectedSetting("Colors");
                          },
                        },
                      ]}
                    />
                  </Card>
                  <Card>
                    <ActionList
                      items={[
                        {
                          content: "Typography",
                          prefix: (
                            <Icon source={TypeMajor} color="inkLightest" />
                          ),
                          suffix: "",
                          onAction: () => {
                            setSelectedSetting("Typography");
                          },
                        },
                      ]}
                    />
                  </Card>
                </>
              )}
              {selectedSetting !== "" && (
                <ActionList
                  items={[
                    {
                      content: (
                        <Text variant="headingXl" as="h4">
                          {selectedSetting}
                        </Text>
                      ),
                      prefix: (
                        <Icon
                          source={MobileBackArrowMajor}
                          color="inkLightest"
                        />
                      ),
                      suffix: "",
                      onAction: () => {
                        setSelectedSetting("");
                      },
                    },
                  ]}
                />
              )}
              {selectedSetting === "Header" && (
                <Card>
                  <Card.Section>
                    <TextField
                      label="Text"
                      placeholder="Header"
                      {...fields.headerText}
                    />
                  </Card.Section>
                </Card>
              )}
              {selectedSetting === "Body" && (
                <Card>
                  <Card.Section>
                    <TextField
                      label="Text"
                      placeholder="Body"
                      multiline={4}
                      {...fields.bodyText}
                    />
                  </Card.Section>
                </Card>
              )}
              {selectedSetting === "Footer" && (
                <Card>
                  <Card.Section>
                    <TextField
                      label="Text"
                      placeholder="Footer"
                      {...fields.footerText}
                    />
                  </Card.Section>
                </Card>
              )}
              {selectedSetting === "Colors" && (
                <Card>
                  <Card.Section title="General">
                    <TextField
                      type="text"
                      label="Background color"
                      placeholder="#000000"
                      {...fields.backgroundColor}
                      required
                      connectedLeft={
                        <div style={{ width: 50 }}>
                          <TextField
                            type="color"
                            value={fields.backgroundColor.value}
                            onChange={fields.backgroundColor.onChange}
                            onBlur={fields.backgroundColor.onBlur}
                            required
                          />
                        </div>
                      }
                    />
                  </Card.Section>
                  <Card.Section title="Header">
                    <TextField
                      type="text"
                      label="Text color"
                      placeholder="#000000"
                      {...fields.headerTextColor}
                      required
                      connectedLeft={
                        <div style={{ width: 50 }}>
                          <TextField
                            type="color"
                            value={fields.headerTextColor.value}
                            onChange={fields.headerTextColor.onChange}
                            onBlur={fields.headerTextColor.onBlur}
                            required
                          />
                        </div>
                      }
                    />
                  </Card.Section>
                  <Card.Section title="Body">
                    <TextField
                      type="text"
                      label="Text color"
                      placeholder="#000000"
                      {...fields.bodyTextColor}
                      required
                      connectedLeft={
                        <div style={{ width: 50 }}>
                          <TextField
                            type="color"
                            value={fields.bodyTextColor.value}
                            onChange={fields.bodyTextColor.onChange}
                            onBlur={fields.bodyTextColor.onBlur}
                            required
                          />
                        </div>
                      }
                    />
                  </Card.Section>
                  <Card.Section title="Footer">
                    <TextField
                      type="text"
                      label="Text color"
                      placeholder="#000000"
                      {...fields.footerTextColor}
                      required
                      connectedLeft={
                        <div style={{ width: 50 }}>
                          <TextField
                            type="color"
                            value={fields.footerTextColor.value}
                            onChange={fields.footerTextColor.onChange}
                            onBlur={fields.footerTextColor.onBlur}
                            required
                          />
                        </div>
                      }
                    />
                  </Card.Section>
                </Card>
              )}
              {selectedSetting === "Typography" && (
                <Card>
                  <Card.Section title="Header">
                    <Select
                      label="Font family"
                      options={[
                        {
                          label: "Courier New",
                          value: "Courier New, Courier, monospace",
                        },
                        { label: "Georgia", value: "Georgia, serif" },
                        {
                          label: "Helvetica Neue",
                          value: "Helvetica Neue, Helvetica, Arial, sans-serif",
                        },
                        {
                          label: "Times New Roman",
                          value: "Times New Roman, Times, serif",
                        },
                      ]}
                      {...fields.headerTextFont}
                      required
                    />
                  </Card.Section>
                  <Card.Section title="Body">
                    <Select
                      label="Font family"
                      options={[
                        {
                          label: "Courier New",
                          value: "Courier New, Courier, monospace",
                        },
                        { label: "Georgia", value: "Georgia, serif" },
                        {
                          label: "Helvetica Neue",
                          value: "Helvetica Neue, Helvetica, Arial, sans-serif",
                        },
                        {
                          label: "Times New Roman",
                          value: "Times New Roman, Times, serif",
                        },
                      ]}
                      {...fields.bodyTextFont}
                      required
                    />
                  </Card.Section>
                  <Card.Section title="Footer">
                    <Select
                      label="Font family"
                      options={[
                        {
                          label: "Courier New",
                          value: "Courier New, Courier, monospace",
                        },
                        { label: "Georgia", value: "Georgia, serif" },
                        {
                          label: "Helvetica Neue",
                          value: "Helvetica Neue, Helvetica, Arial, sans-serif",
                        },
                        {
                          label: "Times New Roman",
                          value: "Times New Roman, Times, serif",
                        },
                      ]}
                      {...fields.footerTextFont}
                      required
                    />
                  </Card.Section>
                </Card>
              )}
              <div id="navFooter">
                <Card>
                  <Card.Section>
                    <ButtonGroup>
                      <div style={{ color: "#bf0711" }}>
                        <Button
                          disabled={dirty}
                          monochrome
                          outline
                          onClick={() => {
                            setResetToDefaultModal(true);
                          }}
                        >
                          Reset settings
                        </Button>
                      </div>
                      <div style={{ float: "right" }}>
                        <Button
                          outline
                          url="https://help.shopify.com/en"
                          external={true}
                        >
                          Get help
                        </Button>
                      </div>
                    </ButtonGroup>
                  </Card.Section>
                </Card>
              </div>
            </Navigation>
          ) : null
        }
      >
        <div
          id="preview"
          style={{
            width: previewWidth,
            height: "100%",
            padding: "0.8rem",
          }}
        >
          <Card>
            <PreviewModal
              id="modal"
              style={{ background: fields.backgroundColor.value }}
            >
              <iframe
                title="shop"
                src="https://debut-theme-default.myshopify.com/"
                frameBorder="0"
                scrolling="no"
                allowtransparency="true"
              />
              <PreviewContent id="modal-content">
                <PreviewHeader
                  id="modal-header"
                  style={{
                    color: fields.headerTextColor.value,
                    fontFamily: fields.headerTextFont.value,
                  }}
                >
                  {fields.headerText.value}
                </PreviewHeader>
                <PreviewBody
                  id="modal-body"
                  style={{
                    color: fields.bodyTextColor.value,
                    fontFamily: fields.bodyTextFont.value,
                  }}
                >
                  {fields.bodyText.value.split("\n").map((value, index) => {
                    return <p key={index}>{value}</p>;
                  })}
                </PreviewBody>
                <PreviewFooter
                  id="modal-footer"
                  style={{
                    color: fields.footerTextColor.value,
                    fontFamily: fields.footerTextFont.value,
                  }}
                >
                  {fields.footerText.value}
                </PreviewFooter>
              </PreviewContent>
            </PreviewModal>
          </Card>
        </div>
        {discardConfirmationModalMarkup}
        {resetToDefaultModalMarkup}
        {toastMarkup}
      </Frame>
    </Form>
  );
}

const PreviewModal = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
  text-align: center;
  font-size: 24px;
  font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
  background: #000000;
`;

const PreviewContent = styled.div`
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -45%);
  margin: auto;
  border-radius: 0.3rem;
  background-color: #ffffff;
  padding: 25px;
  border: 1px solid #888;
  width: 100%;
  max-width: 550px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  -webkit-box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2),
    0 6px 20px 0 rgba(0, 0, 0, 0.19);
`;

const PreviewHeader = styled.div`
  margin-top: 75px;
  margin-bottom: 100px;
`;

const PreviewBody = styled.div`
  margin-bottom: 100px;
`;

const PreviewFooter = styled.div`
  margin-bottom: 75px;
`;
